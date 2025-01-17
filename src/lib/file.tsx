import { RiImage2Line, RiFileZipLine, RiFileUnknowLine, RiFilePdf2Line } from "react-icons/ri";

/**
 * Formats a size in bytes to a human-readable string with appropriate units.
 *
 * @param {number} bytes - The size in bytes to format.
 * @returns {string} - The formatted size with appropriate units (bits, bytes, kB, MB, etc.).
 */
export function formatSize(bytes: number): string {
  const units = ["bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let index = 0;
  let size = bytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

/**
 * Determines the file type based on the MIME type.
 *
 * @param {string} mimeType - The MIME type of the file to check.
 * @returns {string} - The type of the file (e.g., "image", "pdf", "zip", etc.).
 */
export function getFileType(mimeType: string): string {
  const mimeTypeMap: Record<string, string> = {
    "image/jpeg": "image",
    "image/png": "image",
    "image/gif": "image",
    "image/bmp": "image",
    "image/tiff": "image",
    "image/svg+xml": "image",
    "application/pdf": "pdf",
    "application/zip": "zip",
    "application/x-rar-compressed": "zip",
    "application/x-7z-compressed": "zip",
    "application/x-tar": "zip",
    "application/gzip": "zip",
  };

  return mimeTypeMap[mimeType.toLowerCase()] || "unknown";
}

/**
 * Returns a React icon component based on the file type.
 *
 * @param {string} fileType - The type of the file (e.g., "image", "pdf", "zip", etc.).
 * @returns {JSX.Element} - The corresponding icon component for the file type.
 */
export function getFileIcon(fileType: string): JSX.Element {
  const type = getFileType(fileType);

  const iconMap: Record<string, JSX.Element> = {
    image: <RiImage2Line />,
    pdf: <RiFilePdf2Line />,
    zip: <RiFileZipLine />,
  };

  return iconMap[type] || <RiFileUnknowLine />;
}
