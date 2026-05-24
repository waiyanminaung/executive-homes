"use client";

import { useEffect, useRef, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import {
  WATCH_PARTY_HOST_TOKEN_QUERY_KEY,
  WATCH_PARTY_ROOM_QUERY_KEY,
  WATCH_PARTY_SYNC_THROTTLE_MS,
} from "@/constants/watchParty";
import { useRead, useWrite } from "@/lib/spoosh";
import type {
  WatchPartyPlaybackStatus,
  WatchPartyRoom,
  WatchPartyStreamEvent,
} from "@/types/watchParty";

interface PlaybackUpdate {
  currentTime: number;
  status: WatchPartyPlaybackStatus;
}

interface UseMoviePartyRoomParams {
  isControllableSource: boolean;
}

export const useMoviePartyRoom = ({
  isControllableSource,
}: UseMoviePartyRoomParams) => {
  const [roomId] = useQueryState(WATCH_PARTY_ROOM_QUERY_KEY, parseAsString);
  const [token] = useQueryState(WATCH_PARTY_HOST_TOKEN_QUERY_KEY, parseAsString);
  const [liveRoom, setLiveRoom] = useState<WatchPartyRoom | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const lastSyncRef = useRef<{
    currentTime: number;
    sentAt: number;
    status: WatchPartyPlaybackStatus;
  } | null>(null);
  const roomRequest = useRead(
    (api) => {
      if (token) {
        return api("watch-party/rooms/:roomId").GET({
          params: { roomId: roomId ?? "" },
          query: { token },
        });
      }

      return api("watch-party/rooms/:roomId").GET({
        params: { roomId: roomId ?? "" },
      });
    },
    { enabled: !!roomId },
  );
  const syncRoom = useWrite((api) => api("watch-party/rooms/:roomId/sync").POST());

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const streamUrl = new URL(
      `/api/watch-party/rooms/${roomId}/stream`,
      window.location.origin,
    );

    if (token) {
      streamUrl.searchParams.set("token", token);
    }

    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as WatchPartyStreamEvent;

      if (data.type === "ping") {
        return;
      }

      if (data.type === "room.closed") {
        setIsClosed(true);
        setLiveRoom(null);
        eventSource.close();
        return;
      }

      setIsClosed(false);
      setLiveRoom(data.room);
    };

    return () => {
      eventSource.close();
    };
  }, [roomId, token]);

  const room =
    liveRoom?.roomId === roomId ? liveRoom : (roomRequest.data ?? null);
  const canControl = !!room?.canControl && isControllableSource;
  const unsupportedMessage =
    room && !isControllableSource
      ? "This provider is rendered in an embedded frame, so synced playback control is unavailable for this room."
      : undefined;

  const syncPlaybackState = (
    { currentTime, status }: PlaybackUpdate,
    force = false,
  ) => {
    if (!roomId || !token || !room?.canControl || !isControllableSource) {
      return;
    }

    const normalizedTime = Number(currentTime.toFixed(2));
    const previousUpdate = lastSyncRef.current;
    const now = Date.now();

    if (
      !force &&
      previousUpdate &&
      previousUpdate.status === status &&
      now - previousUpdate.sentAt < WATCH_PARTY_SYNC_THROTTLE_MS &&
      Math.abs(previousUpdate.currentTime - normalizedTime) < 1
    ) {
      return;
    }

    lastSyncRef.current = {
      currentTime: normalizedTime,
      sentAt: now,
      status,
    };

    void syncRoom.trigger({
      body: {
        currentTime: normalizedTime,
        status,
        token,
      },
      params: {
        roomId,
      },
    });
  };

  return {
    canControl,
    isClosed: !!roomId && isClosed,
    isEnabled: !!roomId,
    isLoading: roomRequest.loading,
    room,
    syncPlaybackState,
    unsupportedMessage,
    viewerPlaybackState:
      room && !room.canControl && isControllableSource ? room.state : null,
  };
};
