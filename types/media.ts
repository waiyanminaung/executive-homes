import type { MediaImage } from "@/prisma/generated/prisma/browser";
import type { Jsonify } from "@/types/Jsonify";

export type ClientMediaImage = Jsonify<Omit<MediaImage, "url">> & { url: string };
