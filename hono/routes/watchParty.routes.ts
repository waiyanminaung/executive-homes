import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { WATCH_PARTY_STREAM_KEEPALIVE_MS } from "@/constants/watchParty";
import { watchPartyStore } from "@/lib/watchPartyStore";
import {
  watchPartyCreateRoomSchema,
  watchPartyRoomIdParamSchema,
  watchPartyRoomQuerySchema,
  watchPartySyncSchema,
} from "@/validation/watchPartySchema";
import { zv } from "@/validation/zv";

export const watchPartyRoutes = new Hono()
  .post("/rooms", zv("json", watchPartyCreateRoomSchema), async (c) => {
    const body = c.req.valid("json");
    const room = watchPartyStore.createRoom(body.movieId, body.episodeId);

    return c.json(room, 201);
  })
  .get(
    "/rooms/:roomId",
    zv("param", watchPartyRoomIdParamSchema),
    zv("query", watchPartyRoomQuerySchema),
    async (c) => {
      const { roomId } = c.req.valid("param");
      const { token } = c.req.valid("query");
      const room = watchPartyStore.getRoom(roomId, token);

      if (!room) {
        return c.json({ error: "Room not found" }, 404);
      }

      return c.json(room);
    },
  )
  .post(
    "/rooms/:roomId/sync",
    zv("param", watchPartyRoomIdParamSchema),
    zv("json", watchPartySyncSchema),
    async (c) => {
      const { roomId } = c.req.valid("param");
      const body = c.req.valid("json");
      const room = watchPartyStore.syncRoom(
        roomId,
        body.token,
        body.currentTime,
        body.status,
      );

      if (room === null) {
        return c.json({ error: "Room not found" }, 404);
      }

      if (room === false) {
        return c.json({ error: "Only the host can control the room" }, 403);
      }

      return c.json(room);
    },
  )
  .get(
    "/rooms/:roomId/stream",
    zv("param", watchPartyRoomIdParamSchema),
    zv("query", watchPartyRoomQuerySchema),
    async (c) => {
      const { roomId } = c.req.valid("param");
      const { token } = c.req.valid("query");
      const room = watchPartyStore.getRoom(roomId, token);

      if (!room) {
        return c.json({ error: "Room not found" }, 404);
      }

      c.header("Cache-Control", "no-cache");

      return streamSSE(c, async (stream) => {
        let isClosed = false;
        let unsubscribe: (() => void) | null = null;

        const closeStream = () => {
          if (isClosed) {
            return;
          }

          isClosed = true;
          unsubscribe?.();
          clearInterval(keepAliveTimer);
        };

        const writeRoomEvent = async () => {
          const nextRoom = watchPartyStore.getRoom(roomId, token);

          if (!nextRoom) {
            await stream.writeSSE({
              data: JSON.stringify({
                roomId,
                type: "room.closed",
              }),
            });
            closeStream();
            return;
          }

          await stream.writeSSE({
            data: JSON.stringify({
              room: nextRoom,
              type: "room.updated",
            }),
          });
        };

        const keepAliveTimer = setInterval(() => {
          void stream.writeSSE({
            data: JSON.stringify({
              type: "ping",
            }),
          });
        }, WATCH_PARTY_STREAM_KEEPALIVE_MS);

        unsubscribe = watchPartyStore.subscribe(roomId, () => {
          if (isClosed) {
            return;
          }

          void writeRoomEvent();
        });

        c.req.raw.signal.addEventListener("abort", closeStream, { once: true });

        await writeRoomEvent();

        while (!isClosed) {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      });
    },
  );
