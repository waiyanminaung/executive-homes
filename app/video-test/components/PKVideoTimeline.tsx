"use client";

import type { CSSProperties } from "react";
import { PK_PLAYER_THEME_COLOR } from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";

interface PKVideoTimelineProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

interface RangeStyle extends CSSProperties {
  "--pk-range-active-color": string;
  "--pk-range-progress": string;
}

const formatTime = (seconds: number) => {
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
  onSeek,
}: PKVideoTimelineProps) => {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const seekValue = safeDuration > 0 ? currentTime : 0;
  const seekProgress = safeDuration > 0 ? (seekValue / safeDuration) * 100 : 0;
  const seekStyle: RangeStyle = {
    "--pk-range-active-color": PK_PLAYER_THEME_COLOR,
    "--pk-range-progress": `${seekProgress}%`,
  };

  return (
    <div
      className={classNames(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5",
      )}
    >
      <span
        className={classNames("text-[11px] font-bold tabular-nums text-white")}
      >
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        min="0"
        max={safeDuration || 1}
        step="0.1"
        value={seekValue}
        onChange={(event) => onSeek(Number(event.target.value))}
        className={classNames("pk-player-range w-full")}
        style={seekStyle}
        aria-label="Seek"
      />
      <span
        className={classNames("text-[11px] font-bold tabular-nums text-white")}
      >
        {formatTime(duration)}
      </span>
    </div>
  );
};
