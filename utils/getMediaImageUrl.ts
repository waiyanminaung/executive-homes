import { getMediaUrl } from "@/utils/getMediaUrl";
import { PLACEHOLDER_IMAGE_URL } from "@/app/constants";

export function getMediaImageUrl(mediaImage: { key: string } | null | undefined) {
  return mediaImage ? getMediaUrl(mediaImage.key) : PLACEHOLDER_IMAGE_URL;
}
