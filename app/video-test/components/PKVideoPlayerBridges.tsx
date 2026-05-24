"use client";

import { useEffect, useRef } from "react";
import { selectTime } from "@videojs/react";
import { WATCH_PARTY_SYNC_DRIFT_SECONDS } from "@/constants/watchParty";
import { PK_PLAYER_DEFAULT_VOLUME } from "@/constants/videoPlayer";
import type {
  WatchPartyPlaybackState,
  WatchPartyPlaybackStatus,
} from "@/types/watchParty";
import { Player } from "./PKVideoPlayerInstance";
import {
  getMediaTarget,
  hasInitialTime,
  useInitialResumeSeek,
} from "./useInitialResumeSeek";

interface PKVideoPlayerBridgesProps {
  initialTime?: number;
  isResumePending?: boolean;
  onPlaybackStateChange?: (state: {
    currentTime: number;
    status: WatchPartyPlaybackStatus;
  }) => void;
  onResumePendingChange?: (isPending: boolean) => void;
  onTimeUpdate?: (time: number) => void;
  syncState?: WatchPartyPlaybackState | null;
}

const DefaultVolumeBridge = () => {
  const media = Player.useMedia();
  const hasAppliedDefaultVolumeRef = useRef(false);

  useEffect(() => {
    const mediaTarget = getMediaTarget(media);

    if (!mediaTarget || hasAppliedDefaultVolumeRef.current) {
      return;
    }

    mediaTarget.volume = PK_PLAYER_DEFAULT_VOLUME;
    hasAppliedDefaultVolumeRef.current = true;
  }, [media]);

  return null;
};

const InitialTimeBridge = ({
  initialTime,
  onResumePendingChange,
}: Pick<
  PKVideoPlayerBridgesProps,
  "initialTime" | "onResumePendingChange"
>) => {
  useInitialResumeSeek({
    initialTime,
    onResumePendingChange,
  });

  return null;
};

const TimeUpdateBridge = ({
  initialTime,
  isResumePending,
  onTimeUpdate,
}: Pick<
  PKVideoPlayerBridgesProps,
  "initialTime" | "isResumePending" | "onTimeUpdate"
>) => {
  const time = Player.usePlayer(selectTime);

  useEffect(() => {
    if (!time || isResumePending) {
      return;
    }

    if (hasInitialTime(initialTime) && time.currentTime <= 0) {
      return;
    }

    onTimeUpdate?.(time.currentTime);
  }, [initialTime, isResumePending, onTimeUpdate, time]);

  return null;
};

const PlaybackStateBridge = ({
  onPlaybackStateChange,
}: Pick<PKVideoPlayerBridgesProps, "onPlaybackStateChange">) => {
  const media = Player.useMedia();

  useEffect(() => {
    const mediaTarget = getMediaTarget(media);

    if (!mediaTarget || !onPlaybackStateChange) {
      return undefined;
    }

    const emitPlaybackState = () => {
      onPlaybackStateChange({
        currentTime: mediaTarget.currentTime,
        status: mediaTarget.paused ? "paused" : "playing",
      });
    };

    mediaTarget.addEventListener("play", emitPlaybackState);
    mediaTarget.addEventListener("pause", emitPlaybackState);
    mediaTarget.addEventListener("seeked", emitPlaybackState);
    mediaTarget.addEventListener("timeupdate", emitPlaybackState);

    return () => {
      mediaTarget.removeEventListener("play", emitPlaybackState);
      mediaTarget.removeEventListener("pause", emitPlaybackState);
      mediaTarget.removeEventListener("seeked", emitPlaybackState);
      mediaTarget.removeEventListener("timeupdate", emitPlaybackState);
    };
  }, [media, onPlaybackStateChange]);

  return null;
};

const SyncPlaybackBridge = ({
  syncState,
}: Pick<PKVideoPlayerBridgesProps, "syncState">) => {
  const media = Player.useMedia();
  const appliedRevisionRef = useRef<number | null>(null);

  useEffect(() => {
    if (!syncState || appliedRevisionRef.current === syncState.revision) {
      return;
    }

    const mediaTarget = getMediaTarget(media);

    if (!mediaTarget) {
      return;
    }

    appliedRevisionRef.current = syncState.revision;

    if (
      Math.abs(mediaTarget.currentTime - syncState.currentTime) >
      WATCH_PARTY_SYNC_DRIFT_SECONDS
    ) {
      try {
        mediaTarget.currentTime = syncState.currentTime;
      } catch {
        return;
      }
    }

    if (syncState.status === "playing" && mediaTarget.paused) {
      void mediaTarget.play().catch(() => undefined);
      return;
    }

    if (syncState.status === "paused" && !mediaTarget.paused) {
      mediaTarget.pause();
    }
  }, [media, syncState]);

  return null;
};

export const PKVideoPlayerBridges = ({
  initialTime,
  isResumePending,
  onPlaybackStateChange,
  onResumePendingChange,
  onTimeUpdate,
  syncState,
}: PKVideoPlayerBridgesProps) => {
  return (
    <>
      <DefaultVolumeBridge />
      <InitialTimeBridge
        initialTime={initialTime}
        onResumePendingChange={onResumePendingChange}
      />
      <TimeUpdateBridge
        initialTime={initialTime}
        isResumePending={isResumePending}
        onTimeUpdate={onTimeUpdate}
      />
      <PlaybackStateBridge onPlaybackStateChange={onPlaybackStateChange} />
      <SyncPlaybackBridge syncState={syncState} />
    </>
  );
};
