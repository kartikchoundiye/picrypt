export function formatSize(bytes) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;

  // < 100 KB → KB (bytes)
  if (bytes < 100 * KB) {
    const kb = bytes / KB;
    return `${kb.toFixed(2)} KB ( ${bytes} bytes )`;
  }

  // < 100 MB → MB (KB)
  if (bytes < 100 * MB) {
    const mb = bytes / MB;
    const kb = bytes / KB;
    return `${mb.toFixed(2)} MB ( ${kb.toFixed(2)} KB )`;
  }

  // < 100 GB → GB (MB)
  if (bytes < 100 * GB) {
    const gb = bytes / GB;
    const mb = bytes / MB;
    return `${gb.toFixed(2)} GB ( ${mb.toFixed(2)} MB )`;
  }

  // ≥ 100 GB → TB (GB)
  const tb = bytes / TB;
  const gb = bytes / GB;
  return `${tb.toFixed(2)} TB ( ${gb.toFixed(2)} GB )`;
}

// Supported units in order
const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"];

// Decide common unit based on the largest file
export function getCommonPayloadUnit(files) {
  if (!files || files.length === 0) return "B";

  const maxBytes = Math.max(...files.map(f => f.size));
  let unitIndex = 0;

  let size = maxBytes;
  while (size >= 1024 && unitIndex < SIZE_UNITS.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return SIZE_UNITS[unitIndex];
}

// Convert bytes to a specific unit
export function formatSizeWithUnit(bytes, unit) {
  const unitIndex = SIZE_UNITS.indexOf(unit);
  if (unitIndex === -1) return "0 B";

  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(value < 10 ? 2 : 1)} ${unit}`;
}
