"use client";

import { useEffect, useRef } from "react";
import { selectTime } from "@videojs/react";
import { PK_PLAYER_DEFAULT_VOLUME } from "@/constants/videoPlayer";
import { Player } from "./PKVideoPlayerInstance";

interface PKVideoPlayerBridgesProps {
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
}

const getMediaTarget = (media: unknown) => {
  if (media instanceof HTMLMediaElement) {
    return media;
  }

  if (
    media &&
    typeof media === "object" &&
    "target" in media &&
    media.target instanceof HTMLMediaElement
  ) {
    return media.target;
  }

  return null;
};

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
}: Pick<PKVideoPlayerBridgesProps, "initialTime">) => {
  const time = Player.usePlayer(selectTime);
  const appliedInitialTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(initialTime) || !initialTime || initialTime <= 0) {
      appliedInitialTimeRef.current = null;
      return;
    }

    if (!time || appliedInitialTimeRef.current === initialTime) {
      return;
    }

    appliedInitialTimeRef.current = initialTime;
    void time.seek(initialTime);
  }, [initialTime, time]);

  return null;
};

const TimeUpdateBridge = ({
  onTimeUpdate,
}: Pick<PKVideoPlayerBridgesProps, "onTimeUpdate">) => {
  const time = Player.usePlayer(selectTime);

  useEffect(() => {
    if (!time) {
      return;
    }

    onTimeUpdate?.(time.currentTime);
  }, [onTimeUpdate, time]);

  return null;
};

export const PKVideoPlayerBridges = ({
  initialTime,
  onTimeUpdate,
}: PKVideoPlayerBridgesProps) => {
  return (
    <>
      <DefaultVolumeBridge />
      <InitialTimeBridge initialTime={initialTime} />
      <TimeUpdateBridge onTimeUpdate={onTimeUpdate} />
    </>
  );
};
