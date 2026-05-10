"use client";

import { useEffect, useRef } from "react";
import { selectTime } from "@videojs/react";
import { PK_PLAYER_DEFAULT_VOLUME } from "@/constants/videoPlayer";
import { Player } from "./PKVideoPlayerInstance";
import {
  getMediaTarget,
  hasInitialTime,
  useInitialResumeSeek,
} from "./useInitialResumeSeek";

interface PKVideoPlayerBridgesProps {
  initialTime?: number;
  isResumePending?: boolean;
  onResumePendingChange?: (isPending: boolean) => void;
  onTimeUpdate?: (time: number) => void;
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

export const PKVideoPlayerBridges = ({
  initialTime,
  isResumePending,
  onResumePendingChange,
  onTimeUpdate,
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
    </>
  );
};
