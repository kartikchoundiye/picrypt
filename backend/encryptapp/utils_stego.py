# backend/encryptapp/utils.py
import os
import base64
import io
import struct
import secrets
from typing import List, Tuple, Optional

from django.conf import settings
from Crypto.Protocol.KDF import PBKDF2  # using PyCryptodome style if installed; otherwise use cryptography
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives import constant_time
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from PIL import Image
import piexif
import numpy as np
import magic
import zipfile

# ---------------------------
# low-level crypto helpers
# ---------------------------
def derive_key(passphrase: str, salt: bytes, iterations: int = None) -> bytes:
    if iterations is None:
        iterations = getattr(settings, "PBKDF2_ITERATIONS", 200000)
    kdf = PBKDF2HMAC(
        algorithm=SHA256(),
        length=32,
        salt=salt,
        iterations=iterations,
        backend=default_backend(),
    )
    return kdf.derive(passphrase.encode("utf-8"))

def aes_gcm_encrypt(plaintext: bytes, key: bytes) -> Tuple[bytes, bytes, bytes]:
    iv = secrets.token_bytes(getattr(settings, "AES_GCM_IV_LENGTH", 12))
    aesgcm = AESGCM(key)
    ct = aesgcm.encrypt(iv, plaintext, None)  # ct includes tag appended by AESGCM
    # cryptography returns ciphertext + tag; separate tag of 16 bytes
    tag = ct[-16:]
    ciphertext = ct[:-16]
    return ciphertext, iv, tag

def aes_gcm_decrypt(ciphertext: bytes, key: bytes, iv: bytes, tag: bytes) -> bytes:
    aesgcm = AESGCM(key)
    ct_with_tag = ciphertext + tag
    return aesgcm.decrypt(iv, ct_with_tag, None)

# ---------------------------
# payload compose / parse
# ---------------------------
MAGIC = b"PICR"  # 4 bytes
VERSION = b"\x01"

def compose_payload(file_entries: List[dict], salt: bytes) -> bytes:
    """
    file_entries: list of dicts: { 'filename': str, 'iv': bytes, 'tag': bytes, 'ciphertext': bytes }
    returns bytes ready to embed.
    """
    buf = io.BytesIO()
    buf.write(MAGIC)
    buf.write(VERSION)
    # salt length byte then salt
    buf.write(struct.pack(">B", len(salt)))
    buf.write(salt)
    # number of files (1 byte)
    buf.write(struct.pack(">B", len(file_entries)))
    for entry in file_entries:
        fname_bytes = entry["filename"].encode("utf-8")
        buf.write(struct.pack(">H", len(fname_bytes)))
        # buf.write(struct.pack(">I", len(fname_bytes)))  # filename length 2 bytes
        buf.write(fname_bytes)
        # iv
        buf.write(struct.pack(">B", len(entry["iv"])))
        buf.write(entry["iv"])
        # tag
        buf.write(struct.pack(">B", len(entry["tag"])))
        buf.write(entry["tag"])
        # ciphertext length (8 bytes)
        buf.write(struct.pack(">Q", len(entry["ciphertext"])))
        buf.write(entry["ciphertext"])
    return buf.getvalue()

def parse_payload(payload: bytes) -> dict:
    """
    Returns dict: { salt: bytes, files: [ {filename, iv, tag, ciphertext}, ... ] }
    Raises ValueError if invalid.
    """
    s = io.BytesIO(payload)
    magic = s.read(4)
    if magic != MAGIC:
        raise ValueError("No payload magic")
    ver = s.read(1)
    salt_len = struct.unpack(">B", s.read(1))[0]
    salt = s.read(salt_len)
    num_files = struct.unpack(">B", s.read(1))[0]
    files = []
    for _ in range(num_files):
        fname_len = struct.unpack(">H", s.read(2))[0]
        # fname_len = struct.unpack(">I", s.read(4))[0]
        fname = s.read(fname_len).decode("utf-8")
        iv_len = struct.unpack(">B", s.read(1))[0]
        iv = s.read(iv_len)
        tag_len = struct.unpack(">B", s.read(1))[0]
        tag = s.read(tag_len)
        ct_len = struct.unpack(">Q", s.read(8))[0]
        ct = s.read(ct_len)
        files.append({
            "filename": fname,
            "iv": iv,
            "tag": tag,
            "ciphertext": ct
        })
    return {"salt": salt, "files": files}

# ---------------------------
# MIME & extension helpers
# ---------------------------

# Allowed carrier image extensions only
CARRIER_IMAGE_EXT = {
    ".jpg", ".jpeg", ".png", ".tiff", ".tif", ".bmp"
}

# Allowed payload file extensions only
ALLOWED_EXT = {
    # images handled as carriers
    # allowed payload extensions (full list per your list)
    ".jpg", ".jpeg", ".png",".bmp", ".tif", ".tiff",
    ".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv", ".webm",
    ".mp3", ".wav", ".aac", ".flac", ".wma", ".ogg", ".alac",".m4a",
    ".txt", ".doc", ".docx", ".csv", ".xls", ".xlsx", ".pdf", ".ppt", ".pptx", ".rtf",
    ".c", ".cpp", ".java", ".py", ".html", ".css",
    ".exe", ".dll", ".msi",
    ".zip", ".rar", ".7z", ".tar", ".gz", ".bz2",
    ".xml", ".json", ".sql", ".db",
    ".dwg", ".dxf",
}

def allowed_carrier_image(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in CARRIER_IMAGE_EXT


def allowed_extension(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXT

def detect_mime(file_bytes: bytes) -> str:
    return magic.from_buffer(file_bytes, mime=True)

# ---------------------------
# LSB embedding for PNG/BMP/TIFF/TIF (lossless)
# ---------------------------



def estimate_lsb_capacity(image: Image.Image, bits_per_channel: int = 1) -> int:
    w, h = image.size
    # mode = image.mode  # e.g., "RGB", "RGBA"
    channels = len(image.getbands())
    capacity_bits = w * h * channels * bits_per_channel
    capacity_bytes = capacity_bits // 8
    return capacity_bytes


def embed_payload_in_png_lsb(image_bytes: bytes, payload: bytes, bits_per_channel: int = 1) -> bytes:
    """
    Embed payload into PNG/BMP/TIFF using LSB.
    Format:
        [4-byte big-endian length][base64(payload)]
    """

    # 1️⃣ Base64 encode payload (binary-safe)
    b64_payload = base64.b64encode(payload)

    # 2️⃣ Prefix with 4-byte length
    length_bytes = struct.pack(">I", len(b64_payload))
    full_data = length_bytes + b64_payload

    # 3️⃣ Convert to bit stream
    payload_bits = np.unpackbits(np.frombuffer(full_data, dtype=np.uint8))
    needed_bits = payload_bits.size

    # 4️⃣ Load image
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode not in ("RGB", "RGBA", "L", "LA"):
        img = img.convert("RGBA")

    # 5️⃣ Capacity check (bytes → bits)
    capacity_bytes = estimate_lsb_capacity(img, bits_per_channel=bits_per_channel)
    used_bytes = 0
    try:
        used_bytes = get_used_capacity_from_png(image_bytes)
    except Exception:
        # Image not previously encrypted — safe to assume empty
        used_bytes = 0
    remaining_capacity = capacity_bytes - used_bytes

    if len(full_data) > remaining_capacity:
        raise ValueError(
            "Payload too large for LSB embedding."
        )
    
    
    # if len(full_data) > capacity_bytes:
    #     raise ValueError(
    #         f"Payload too large for LSB embedding. "
    #         # f"Need {len(full_data)} bytes, capacity {capacity_bytes} bytes."
    #     )

    # 6️⃣ Convert image to uint8 array
    arr = np.array(img, dtype=np.uint8)
    flat = arr.flatten()

    total_slots = flat.size * bits_per_channel
    if needed_bits > total_slots:
        raise ValueError("Payload too large for LSB embedding (bit-level check).")

    # 7️⃣ Embed bits
    bit_idx = 0
    for i in range(flat.size):
        if bit_idx >= needed_bits:
            break

        val = int(flat[i])
        clear_mask = ~((1 << bits_per_channel) - 1) & 0xFF
        new_val = val & clear_mask

        bits_to_put = 0
        for b in range(bits_per_channel):
            if bit_idx < needed_bits:
                bits_to_put |= (int(payload_bits[bit_idx]) << b)
                bit_idx += 1

        flat[i] = new_val | bits_to_put

    # 8️⃣ Save image
    new_arr = flat.reshape(arr.shape).astype(np.uint8)
    out_img = Image.fromarray(new_arr, mode=img.mode)

    out_buf = io.BytesIO()
    out_img.save(out_buf, format=img.format or "PNG")

    return out_buf.getvalue()


def extract_payload_from_png_lsb(
    image_bytes: bytes,
    expected_magic: bytes = MAGIC,
    bits_per_channel: int = 1
):
    try:
        img = Image.open(io.BytesIO(image_bytes))
    except Exception:
        return None

    if img.mode not in ("RGB", "RGBA", "L", "LA"):
        img = img.convert("RGBA")

    # 1️⃣ Read image into array
    arr = np.array(img, dtype=np.uint8)
    flat = arr.flatten()

    # 2️⃣ Extract ONLY LSBs (1 bit per byte)
    bits = [(int(v) & 1) for v in flat]

    bits_arr = np.array(bits, dtype=np.uint8)
    byte_len = (bits_arr.size // 8) * 8
    if byte_len < 32:  # need at least 4 bytes
        return None

    raw = np.packbits(bits_arr[:byte_len]).tobytes()

    # 3️⃣ Read length prefix
    length = struct.unpack(">I", raw[:4])[0]
    if length <= 0 or len(raw) < 4 + length:
        return None

    # 4️⃣ Extract base64 payload
    b64_payload = raw[4:4 + length]

    try:
        decoded = base64.b64decode(b64_payload, validate=True)
    except Exception:
        return None

    # 5️⃣ Verify magic header
    if not decoded.startswith(expected_magic):
        return None

    return decoded

def get_used_capacity_from_png(image_bytes: bytes, bits_per_channel: int = 1) -> int:
    """
    Returns how many bytes are already used by embedded payload.
    Returns 0 if no payload is found.
    """
    payload = extract_payload_from_png_lsb(image_bytes)
    if not payload:
        return 0

    # payload is raw decoded payload (before base64)
    # during embedding we base64-encode + add 4-byte length
    import base64
    b64_len = len(base64.b64encode(payload))
    return 4 + b64_len


def embed_payload_in_jpeg_app(image_bytes: bytes, payload: bytes) -> bytes:
    if image_bytes[:2] != b"\xff\xd8":
        raise ValueError("Not a valid JPEG")

    marker = b"\xff\xe2"  # APP2
    identifier = b"PICRAPP"

    MAX_CHUNK = 65533 - len(identifier)  # JPEG safe limit

    segments = []
    for i in range(0, len(payload), MAX_CHUNK):
        chunk = payload[i:i + MAX_CHUNK]
        segment_data = identifier + chunk
        length = len(segment_data) + 2
        segments.append(marker + struct.pack(">H", length) + segment_data)

    return image_bytes[:2] + b"".join(segments) + image_bytes[2:]


def extract_payload_from_jpeg_app(image_bytes: bytes) -> Optional[bytes]:
    data = image_bytes
    offset = 2  # skip SOI
    payload_parts = []

    while offset < len(data) - 4:
        if data[offset] != 0xFF:
            break

        marker = data[offset + 1]
        if marker == 0xE2:  # APP2
            length = struct.unpack(">H", data[offset + 2:offset + 4])[0]
            segment = data[offset + 4:offset + 2 + length]
            if segment.startswith(b"PICRAPP"):
                payload_parts.append(segment[len(b"PICRAPP"):])
            offset += 2 + length
        else:
            length = struct.unpack(">H", data[offset + 2:offset + 4])[0]
            offset += 2 + length

    if not payload_parts:
        return None

    return b"".join(payload_parts)


def get_carrier_info(image_bytes: bytes, filename: str):
    """
    Returns carrier format, dimensions, channels, and estimated capacity (bytes)
    """
    from PIL import Image
    import io
    import os
    
    file_size_bytes = len(image_bytes)
    img = Image.open(io.BytesIO(image_bytes))
    # format = (img.format or "").lower()
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    width, height = img.size
    mode = img.mode
    channels = len(mode) if mode != "L" else 1

    capacity_bytes = None
    used_bytes = 0
    remaining_capacity = None
    if ext in ("png", "bmp", "tiff", "tif"):
    # if format in ("png", "bmp", "tiff", "tif"):
        capacity_bytes = estimate_lsb_capacity(img, bits_per_channel=1)
        used_bytes = get_used_capacity_from_png(image_bytes, bits_per_channel=1)
        remaining_capacity = max(capacity_bytes - used_bytes, 0)

    return {
        # "format": format,
        "carrier_ext": ext,   
        "width": width,
        "height": height,
        "channels": channels,
        "file_size_bytes": file_size_bytes,
        "capacity_bytes": capacity_bytes,
        "used_bytes": used_bytes,
        "remaining_capacity": remaining_capacity
    }
