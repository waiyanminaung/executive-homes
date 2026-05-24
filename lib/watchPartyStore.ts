import { randomBytes } from "node:crypto";
import {
  WATCH_PARTY_ROOM_TTL_MS,
} from "@/constants/watchParty";
import type { WatchPartyPlaybackStatus, WatchPartyRoom } from "@/types/watchParty";

interface WatchPartyRoomInternal {
  episodeId?: string;
  expiresAt: number;
  hostToken: string;
  listeners: Map<string, () => void>;
  movieId: string;
  roomId: string;
  state: {
    currentTime: number;
    revision: number;
    status: WatchPartyPlaybackStatus;
    updatedAt: number;
  };
}

const WATCH_PARTY_ROOM_CODE_BYTES = 4;
const WATCH_PARTY_TOKEN_BYTES = 18;

const createRoomCode = () => {
  return randomBytes(WATCH_PARTY_ROOM_CODE_BYTES).toString("hex").toUpperCase();
};

const createToken = () => {
  return randomBytes(WATCH_PARTY_TOKEN_BYTES).toString("base64url");
};

const normalizeTime = (value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Number(value.toFixed(2));
};

const buildWatchPath = (
  room: WatchPartyRoomInternal,
  includeHostToken: boolean,
) => {
  const params = new URLSearchParams({
    room: room.roomId,
  });

  if (room.episodeId) {
    params.set("episode", room.episodeId);
  }

  if (includeHostToken) {
    params.set("token", room.hostToken);
  }

  return `/movie/${room.movieId}?${params.toString()}`;
};

const buildJoinPath = (room: WatchPartyRoomInternal) => {
  const params = new URLSearchParams({
    room: room.roomId,
  });

  if (room.episodeId) {
    params.set("episode", room.episodeId);
  }

  return `/movie/${room.movieId}?${params.toString()}`;
};

class WatchPartyStore {
  private readonly rooms = new Map<string, WatchPartyRoomInternal>();

  private cleanupExpiredRooms(now = Date.now()) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.expiresAt > now) {
        continue;
      }

      this.broadcastRoomClosed(roomId, room);
      this.rooms.delete(roomId);
    }
  }

  private createSummary(
    room: WatchPartyRoomInternal,
    token?: string,
  ): WatchPartyRoom {
    const canControl = token === room.hostToken;

    return {
      canControl,
      episodeId: room.episodeId,
      expiresAt: new Date(room.expiresAt).toISOString(),
      joinPath: buildJoinPath(room),
      movieId: room.movieId,
      role: canControl ? "host" : "viewer",
      roomId: room.roomId,
      state: {
        currentTime: room.state.currentTime,
        revision: room.state.revision,
        status: room.state.status,
        updatedAt: new Date(room.state.updatedAt).toISOString(),
      },
      viewerCount: room.listeners.size,
      watchPath: buildWatchPath(room, canControl),
    };
  }

  private notifyRoomUpdated(room: WatchPartyRoomInternal) {
    for (const listener of room.listeners.values()) {
      listener();
    }
  }

  private broadcastRoomClosed(
    roomId: string,
    room: WatchPartyRoomInternal,
  ) {
    for (const listener of room.listeners.values()) {
      listener();
    }

    room.listeners.clear();
    this.rooms.delete(roomId);
  }

  createRoom(movieId: string, episodeId?: string) {
    this.cleanupExpiredRooms();

    let roomId = createRoomCode();

    while (this.rooms.has(roomId)) {
      roomId = createRoomCode();
    }

    const room: WatchPartyRoomInternal = {
      episodeId,
      expiresAt: Date.now() + WATCH_PARTY_ROOM_TTL_MS,
      hostToken: createToken(),
      listeners: new Map(),
      movieId,
      roomId,
      state: {
        currentTime: 0,
        revision: 1,
        status: "paused",
        updatedAt: Date.now(),
      },
    };

    this.rooms.set(roomId, room);

    return this.createSummary(room, room.hostToken);
  }

  getRoom(roomId: string, token?: string) {
    this.cleanupExpiredRooms();

    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    return this.createSummary(room, token);
  }

  subscribe(roomId: string, listener: () => void) {
    this.cleanupExpiredRooms();

    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    const subscriptionId = createToken();

    room.listeners.set(subscriptionId, listener);
    this.notifyRoomUpdated(room);

    return () => {
      const activeRoom = this.rooms.get(roomId);

      if (!activeRoom) {
        return;
      }

      activeRoom.listeners.delete(subscriptionId);
      this.notifyRoomUpdated(activeRoom);
    };
  }

  syncRoom(
    roomId: string,
    token: string,
    currentTime: number,
    status: WatchPartyPlaybackStatus,
  ) {
    this.cleanupExpiredRooms();

    const room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    if (room.hostToken !== token) {
      return false;
    }

    room.expiresAt = Date.now() + WATCH_PARTY_ROOM_TTL_MS;
    room.state = {
      currentTime: normalizeTime(currentTime),
      revision: room.state.revision + 1,
      status,
      updatedAt: Date.now(),
    };

    this.notifyRoomUpdated(room);

    return this.createSummary(room, token);
  }
}

declare global {
  var __watchPartyStore: WatchPartyStore | undefined;
}

export const watchPartyStore =
  globalThis.__watchPartyStore ?? new WatchPartyStore();

if (!globalThis.__watchPartyStore) {
  globalThis.__watchPartyStore = watchPartyStore;
}
