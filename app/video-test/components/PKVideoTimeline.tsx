"use client";

import type { CSSProperties } from "react";
import { PK_PLAYER_THEME_COLOR } from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";
import { PKVideoSlider } from "./PKVideoSlider";

interface PKVideoTimelineProps {
  currentTime: number;
  duration: number;
  bufferedPercent?: number;
  showTimeLabels?: boolean;
  onInteractionEnd?: () => void;
  onInteractionStart?: () => void;
  onInteraction?: () => void;
  onSeek: (time: number) => void;
}

interface RangeStyle extends CSSProperties {
  "--pk-range-active-color": string;
  "--pk-range-progress": string;
  "--pk-range-buffer": string;
}

export const formatVideoTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) {
    return "0:00:00";
  }

  const normalizedSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(normalizedSeconds / 3600);
  const minutes = Math.floor((normalizedSeconds % 3600) / 60);
  const remainingSeconds = normalizedSeconds % 60;

  return [
    hours.toString(),
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ].join(":");
};

export const PKVideoTimeline = ({
  currentTime,
  duration,
  bufferedPercent = 0,
  showTimeLabels = true,
  onInteractionEnd,
  onInteractionStart,
  onInteraction,
  onSeek,
}: PKVideoTimelineProps) => {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const seekValue = safeDuration > 0 ? currentTime : 0;
  const seekProgress = safeDuration > 0 ? (seekValue / safeDuration) * 100 : 0;
  const seekStyle: RangeStyle = {
    "--pk-range-active-color": PK_PLAYER_THEME_COLOR,
    "--pk-range-progress": `${seekProgress}%`,
    "--pk-range-buffer": `${Math.min(Math.max(bufferedPercent, 0), 100)}%`,
  };

  return (
    <div
      className={classNames(
        showTimeLabels
          ? "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5"
          : "grid grid-cols-1 items-center",
      )}
    >
      {showTimeLabels && (
        <span
          className={classNames(
            "text-[11px] font-bold tabular-nums text-white",
          )}
        >
          {formatVideoTime(currentTime)}
        </span>
      )}
      <PKVideoSlider
        min={0}
        max={safeDuration || 1}
        step={0.1}
        value={seekValue}
        onChange={onSeek}
        onInteraction={onInteraction}
        onInteractionEnd={onInteractionEnd}
        onInteractionStart={onInteractionStart}
        className={classNames("w-full")}
        style={seekStyle}
        ariaLabel="Seek"
      />
      {showTimeLabels && (
        <span
          className={classNames(
            "text-[11px] font-bold tabular-nums text-white",
          )}
        >
          {formatVideoTime(duration)}
        </span>
      )}
    </div>
  );
};
