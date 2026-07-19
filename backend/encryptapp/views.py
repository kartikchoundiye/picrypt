# backend/encryptapp/views.py

from rest_framework import generics, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView 
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from .models import OTP
from .utils import generate_and_send_otp 
from .utils_stego import *
from .serializers import MyTokenObtainPairSerializer
from django.http import FileResponse, Http404,JsonResponse
from django.conf import settings
import random
import os, io
import logging
import zipfile
import tempfile
from rest_framework import status, permissions
from django.core.files.storage import default_storage
from .utils_stego import (
    allowed_carrier_image, allowed_extension, detect_mime,
    derive_key, aes_gcm_encrypt, aes_gcm_decrypt, estimate_lsb_capacity,
    compose_payload, parse_payload,
    embed_payload_in_png_lsb, extract_payload_from_png_lsb,
    embed_payload_in_jpeg_app, extract_payload_from_jpeg_app
)
from .models import History

# --- PART 1: SEND OTP ---
# ... (SendOTPView and VerifyOTPAndRegisterView are assumed correct) ...

class SendOTPView(APIView):
# ... (Your existing code) ...
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email is already registered and active
        if User.objects.filter(email=email).exists():
             return Response({'error': 'This email is already registered and active.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email is associated with a non-active user (for future logic)

        # generate_and_send_otp(email)
        success = generate_and_send_otp(email)

        if not success:
            return Response({'error': 'Failed to send OTP. Please check the email address or try again later.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)

# --- PART 2: VERIFY OTP AND REGISTER ---

class VerifyOTPAndRegisterView(APIView):
# ... (Your existing code) ...
    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp')
        password = request.data.get('password')

        if not all([email, otp_code, password]):
            return Response({'error': 'Email, OTP, and Password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            otp_obj = OTP.objects.get(email=email)
        except OTP.DoesNotExist:
            return Response({'error': 'OTP record not found for this email.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.otp_code != otp_code:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        if otp_obj.expires_at < timezone.now():
            # Clean up expired OTP
            otp_obj.delete() 
            return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Registration is successful, create the Django User
        try:
            # Use email as the username if you want a simple unique identifier
            # or generate a unique username based on the email
            # username = email.split('@')[0]
            username = email
            
            # Ensure uniqueness if you use the local part of the email as username
            # In a real app, you might use UUIDs or a more complex scheme for username
            if User.objects.filter(username=username).exists():
                 # Append a random number if the username already exists
                 username = f"{username}_{random.randint(100, 999)}" 

            user = User.objects.create_user(
                username=username, 
                email=email, 
                password=password
            )
            user.is_active = True # User is active after OTP verification
            user.save()
            
            # Clean up the OTP record after successful registration
            otp_obj.delete() 

            return Response({'message': 'User registered and account activated successfully.'}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Registration error: {e}")
            return Response({'error': f'Registration failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- PART 3: LOGIN VIEW (Customized JWT) ---

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Inherits from Simple JWT's view , Overrides the default TokenObtainPairView and uses our custom serializer
    to allow authentication via email/password.
    """
    serializer_class = MyTokenObtainPairSerializer


class EncryptView(APIView):
    permission_classes = [permissions.AllowAny]  # change to IsAuthenticated if required

    def post(self, request):
        carrier = request.FILES.get("carrier_image")
        if not allowed_carrier_image(carrier.name):
            return Response(
                {
                    "error": (
                        "Unsupported carrier image format. "
                        "Please upload a valid image file "
                        "(.jpg, .jpeg, .png, .tif, .tiff, .bmp)."
                    )
                },
                status=400
            )

        files = request.FILES.getlist("files")
        passphrase = request.data.get("passphrase", "")
        user = request.user if request.user.is_authenticated else None

        if not carrier or not passphrase:
            return Response({"error": "Carrier image and passphrase are required."}, status=400)
        if not files or len(files) == 0:
            return Response({"error": "At least one file must be uploaded to embed."}, status=400)
        # if len(files) > 2:
        #     return Response({"error": "Maximum 2 files allowed."}, status=400)

        # validate extensions and size
        files_info = []
        total_payload_size = 0
        file_entries = []
        salt = os.urandom(getattr(settings, "ENCRYPTION_SALT_LENGTH", 16))

        for f in files:
            if not allowed_extension(f.name):
                return Response({"error": f"File extension not allowed: {f.name}"}, status=400)
            content = f.read()
            mime = detect_mime(content)
            entry_key = derive_key(passphrase, salt)
            ciphertext, iv, tag = aes_gcm_encrypt(content, entry_key)
            file_entries.append({
                "filename": f.name,
                "iv": iv,
                "tag": tag,
                "ciphertext": ciphertext
            })
            files_info.append({"name": f.name, "size": len(content), "mime": mime})
            total_payload_size += len(ciphertext) + len(iv) + len(tag) + 512  # overhead rough

        # compose payload
        payload = compose_payload(file_entries, salt)

        # read carrier bytes
        carrier_bytes = carrier.read()
        # decide strategy by format (use pillow detect)
        from PIL import Image
        try:
            img = Image.open(io.BytesIO(carrier_bytes))
            format = img.format.lower() if img.format else "png"
        except Exception as e:
            return Response({"error": "Invalid carrier image"}, status=400)

        try:
            if format in ("png", "bmp", "tiff","tif"):
                # capacity check BEFORE embedding
                stego_bytes = embed_payload_in_png_lsb(carrier_bytes, payload, bits_per_channel=1)
                try:
                    capacity_bytes = estimate_lsb_capacity(img, bits_per_channel=1)
                except Exception:
                    return Response({"error": "Unable to estimate image capacity."}, status=400)

                # we will embed base64(payload) — so compute base64 size
                import base64
                b64_payload_len = len(base64.b64encode(payload))
                max_allowed = getattr(settings, "DEFAULT_MAX_PAYLOAD_BYTES", 1_000_000)
                if b64_payload_len > capacity_bytes:
                    # payload too large for LSB embedding
                    return Response({
                        "error": "Carrier image capacity insufficient for embedding. "
                                f"Base64 payload requires {b64_payload_len} bytes but capacity is {capacity_bytes} bytes. "
                                "Use a larger image or smaller files."
                    }, status=400)
                # also respect global payload limit
                if len(payload) > max_allowed:
                    return Response({"error": f"Total payload ({len(payload)} bytes) exceeds configured maximum ({max_allowed} bytes)."}, status=400)

                # attempt embed
                try:
                    stego_bytes = embed_payload_in_png_lsb(carrier_bytes, payload, bits_per_channel=1)
                except ValueError as ve:
                    return Response({"error": f"Failed to embed payload : {str(ve)}"}, status=400)
                except Exception as e:
                    # generic fallback
                    return Response({"error": f"Failed to embed payload : {str(e)}"}, status=500)
            elif format in ("jpeg", "jpg"):
                stego_bytes = embed_payload_in_jpeg_app(carrier_bytes, payload)
            else:
                # fallback to embedding APP for unknown types
                stego_bytes = embed_payload_in_jpeg_app(carrier_bytes, payload)
        except Exception as e:
            History.objects.create(user=user, action="encrypt", carrier_filename=carrier.name, stego_filename="", files_info=files_info, payload_size=len(payload), success=False, error_message=str(e), timestamp=timezone.now())
            return Response({"error": "Failed to embed payload : " + str(e)}, status=500)

        # save stego file
        filename = f"stego_{int(timezone.now().timestamp())}_{carrier.name}"
        path = os.path.join("stego", filename)
        full_path = os.path.join(settings.MEDIA_ROOT, path)
        with open(full_path, "wb") as out:
            out.write(stego_bytes)

        History.objects.create(user=user, action="encrypt", carrier_filename=carrier.name, stego_filename=path, files_info=files_info, payload_size=len(payload), success=True, timestamp=timezone.now())

        # return stego file as download URL or file response
        # simple approach: return URL to download
        download_url = request.build_absolute_uri(settings.MEDIA_URL + path)
        return Response({"message": "Encryption successful", "download_url": download_url, "history_path": path}, status=200)

class DecryptView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        stego = request.FILES.get("stego_image")

        if not allowed_carrier_image(stego.name):
            return Response(
                {
                    "error": (
                        "Unsupported stego image format. "
                        "Please upload a valid image file "
                        "(.jpg, .jpeg, .png, .tif, .tiff, .bmp)."
                    )
                },
                status=400
            )


        passphrase = request.data.get("passphrase", "")
        user = request.user if request.user.is_authenticated else None

        if not stego or not passphrase:
            return Response({"error": "Stego image and passphrase are required."}, status=400)

        stego_bytes = stego.read()
        payload = None

        # Try PNG LSB extraction first
        try:
            payload = extract_payload_from_png_lsb(stego_bytes)
        except Exception:
            payload = None

        # If not found, try JPEG APP segment extraction
        if payload is None:
            try:
                payload = extract_payload_from_jpeg_app(stego_bytes)
            except Exception:
                payload = None

        if not payload:
            # return clear JSON, not generic 500
            History.objects.create(user=user, action="decrypt", carrier_filename=stego.name, files_info=[], payload_size=0, success=False, error_message="No payload found", timestamp=timezone.now())
            return Response({"error": "No embedded data found."}, status=400)


        # 1) Decode payload structure
        try:
            parsed = parse_payload(payload)
        except Exception as e:
            History.objects.create(
                user=user,
                action="decrypt",
                carrier_filename=stego.name,
                files_info=[],
                payload_size=len(payload),
                success=False,
                error_message="Payload parse error",
                timestamp=timezone.now()
            )
            return Response({"error": "Corrupt payload or unsupported format."}, status=400)

        # 2) Extract required components
        salt = parsed["salt"]
        files = parsed["files"]

        # 3) Derive AES key using user passphrase
        key = derive_key(passphrase, salt)

        # 4) Decrypt each embedded file
        extracted_files = []
        for f in files:
            try:
                plaintext = aes_gcm_decrypt(
                    f["ciphertext"],
                    key,
                    f["iv"],
                    f["tag"]
                )
                extracted_files.append({
                    "filename": f["filename"],
                    "content": plaintext
                })
            except Exception:
                return Response({"error": "Wrong passphrase or corrupted data."}, status=400)

        # 5) Create zip file
        tmp = io.BytesIO()
        with zipfile.ZipFile(tmp, "w") as zf:
            for ef in extracted_files:
                zf.writestr(ef["filename"], ef["content"])
        tmp.seek(0)

        # save zip temp file to media/temp for serving
        zip_name = f"decrypted_{int(timezone.now().timestamp())}.zip"
        zip_path = os.path.join(settings.MEDIA_ROOT, "temp", zip_name)
        with open(zip_path, "wb") as fh:
            fh.write(tmp.read())

        files_info = [{"name": ef["filename"], "size": len(ef["content"])} for ef in extracted_files]
        History.objects.create(user=user, action="decrypt", carrier_filename=stego.name, files_info=files_info, payload_size=len(payload), success=True, timestamp=timezone.now(), stego_filename="temp/" + zip_name)

        download_url = request.build_absolute_uri(settings.MEDIA_URL + "temp/" + zip_name)
        return Response({"message": "Decryption successful", "download_url": download_url}, status=200)
    

# Serializer for the History model
class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = [
            "id",
            "action",
            "carrier_filename",
            "stego_filename",
            "files_info",
            "payload_size",
            "success",
            "error_message",
            "timestamp",
        ]
        read_only_fields = fields


# History list view — returns records for the logged-in user
class HistoryListView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]  # require login
    def get_queryset(self):
        user = self.request.user
        return History.objects.filter(user=user).order_by("-timestamp")


class CarrierInfoView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        carrier = request.FILES.get("carrier_image")
        if not carrier:
            return Response({"error": "Carrier image required"}, status=400)

        carrier_bytes = carrier.read()
        try:
            info = get_carrier_info(carrier_bytes, carrier.name)
            return Response(info, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
