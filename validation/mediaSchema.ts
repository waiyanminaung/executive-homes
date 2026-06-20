export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

export const SMALL_FILE_THRESHOLD_BYTES = 200 * 1024;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];
