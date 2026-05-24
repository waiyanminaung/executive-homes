import { z } from "zod";

const watchPartyTokenSchema = z.string().min(8).max(128);

export const watchPartyRoomIdParamSchema = z.object({
  roomId: z
    .string()
    .trim()
    .min(6)
    .max(12)
    .regex(/^[A-Z0-9]+$/),
});

export const watchPartyRoomQuerySchema = z.object({
  token: watchPartyTokenSchema.optional(),
});

export const watchPartyCreateRoomSchema = z.object({
  episodeId: z.string().min(1).optional(),
  movieId: z.string().min(1),
});

export const watchPartySyncSchema = z.object({
  currentTime: z.number().min(0),
  status: z.enum(["playing", "paused"]),
  token: watchPartyTokenSchema,
});

export const watchPartyJoinSchema = z.object({
  codeOrUrl: z.string().trim().min(1, "Room code is required."),
});

export type WatchPartyCreateRoomInput = z.infer<
  typeof watchPartyCreateRoomSchema
>;
export type WatchPartyJoinInput = z.infer<typeof watchPartyJoinSchema>;
export type WatchPartySyncInput = z.infer<typeof watchPartySyncSchema>;
