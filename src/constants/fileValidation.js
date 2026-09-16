export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export const FIELD_TYPE_MAP = {
  avatar: ALLOWED_IMAGE_TYPES,
  coverImage: ALLOWED_IMAGE_TYPES,
  thumbnail: ALLOWED_IMAGE_TYPES,
  videoFile: ALLOWED_VIDEO_TYPES,
};