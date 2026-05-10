"use client";

import { useEffect, useRef } from "react";
import { Player } from "./PKVideoPlayerInstance";

export const hasInitialTime = (time?: number): time is number => {
  return Number.isFinite(time) && !!time && time > 0;
};

export const getMediaTarget = (media: unknown) => {
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

interface UseInitialResumeSeekParams {
  initialTime?: number;
  onResumePendingChange?: (isPending: boolean) => void;
}

export const useInitialResumeSeek = ({
  initialTime,
  onResumePendingChange,
}: UseInitialResumeSeekParams) => {
  const media = Player.useMedia();
  const appliedMediaTargetRef = useRef<HTMLMediaElement | null>(null);
  const appliedInitialTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasInitialTime(initialTime)) {
      appliedMediaTargetRef.current = null;
      appliedInitialTimeRef.current = null;
      onResumePendingChange?.(false);
      return undefined;
    }

    const resumeTime = initialTime;
    const mediaTarget = getMediaTarget(media);
    const currentMediaTarget = mediaTarget;
    const hasAppliedInitialTime =
      appliedMediaTargetRef.current === currentMediaTarget &&
      appliedInitialTimeRef.current === resumeTime;

    onResumePendingChange?.(!hasAppliedInitialTime);

    if (!currentMediaTarget || hasAppliedInitialTime) {
      return undefined;
    }

    const applyInitialTime = () => {
      if (
        appliedMediaTargetRef.current === currentMediaTarget &&
        appliedInitialTimeRef.current === resumeTime
      ) {
        return true;
      }

      if (currentMediaTarget.readyState < HTMLMediaElement.HAVE_METADATA) {
        return false;
      }

      const nextTime =
        Number.isFinite(currentMediaTarget.duration) &&
        currentMediaTarget.duration > 0
          ? Math.min(resumeTime, currentMediaTarget.duration)
          : resumeTime;

      try {
        currentMediaTarget.currentTime = nextTime;
      } catch {
        return false;
      }

      appliedMediaTargetRef.current = currentMediaTarget;
      appliedInitialTimeRef.current = resumeTime;
      onResumePendingChange?.(false);

      return true;
    };

    if (applyInitialTime()) {
      return undefined;
    }

    currentMediaTarget.addEventListener("loadedmetadata", applyInitialTime);
    currentMediaTarget.addEventListener("durationchange", applyInitialTime);
    currentMediaTarget.addEventListener("canplay", applyInitialTime);

    return () => {
      currentMediaTarget.removeEventListener(
        "loadedmetadata",
        applyInitialTime,
      );
      currentMediaTarget.removeEventListener(
        "durationchange",
        applyInitialTime,
      );
      currentMediaTarget.removeEventListener("canplay", applyInitialTime);
    };
  }, [initialTime, media, onResumePendingChange]);
};
