export type WatchPartyPlaybackStatus = "playing" | "paused";

export type WatchPartyRole = "host" | "viewer";

export interface WatchPartyPlaybackState {
  currentTime: number;
  revision: number;
  status: WatchPartyPlaybackStatus;
  updatedAt: string;
}

export interface WatchPartyRoom {
  canControl: boolean;
  episodeId?: string;
  expiresAt: string;
  joinPath: string;
  movieId: string;
  role: WatchPartyRole;
  roomId: string;
  state: WatchPartyPlaybackState;
  viewerCount: number;
  watchPath: string;
}

export interface WatchPartyStreamRoomUpdatedEvent {
  room: WatchPartyRoom;
  type: "room.updated";
}

export interface WatchPartyStreamRoomClosedEvent {
  roomId: string;
  type: "room.closed";
}

export interface WatchPartyStreamPingEvent {
  type: "ping";
}

export type WatchPartyStreamEvent =
  | WatchPartyStreamPingEvent
  | WatchPartyStreamRoomClosedEvent
  | WatchPartyStreamRoomUpdatedEvent;
