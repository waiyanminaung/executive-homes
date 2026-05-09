"use client";

import type { CSSProperties } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PK_PLAYER_SEEK_SECONDS } from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";
import { PKVideoControlButton } from "./PKVideoControlButton";
import { PKVideoPlaybackSpeedMenu } from "./PKVideoPlaybackSpeedMenu";
import { formatVideoTime, PKVideoTimeline } from "./PKVideoTimeline";

interface PKVideoPlayerControlsProps {
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  isVisible: boolean;
  playbackRate: number;
  volume: number;
  onPlayToggle: () => void;
  onSeek: (time: number) => void;
  onSeekBy: (seconds: number) => void;
  onFullscreenToggle: () => void;
  onInteraction: () => void;
  onInteractionEnd: () => void;
  onInteractionStart: () => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: (playbackRate: number) => void;
  onVolumeChange: (volume: number) => void;
}

interface RangeStyle extends CSSProperties {
  "--pk-range-active-color": string;
  "--pk-range-progress": string;
}

export const PKVideoPlayerControls = ({
  currentTime,
  duration,
  isFullscreen,
  isMuted,
  isPlaying,
  isVisible,
  playbackRate,
  volume,
  onPlayToggle,
  onSeek,
  onSeekBy,
  onFullscreenToggle,
  onInteraction,
  onInteractionEnd,
  onInteractionStart,
  onMuteToggle,
  onPlaybackRateChange,
  onVolumeChange,
}: PKVideoPlayerControlsProps) => {
  const volumeProgress = isMuted ? 0 : volume * 100;
  const volumeStyle: RangeStyle = {
    "--pk-range-active-color": "#ffffff",
    "--pk-range-progress": `${volumeProgress}%`,
  };
  const keepControlsVisible = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onInteraction();
  };
  const startControlsInteraction = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onInteractionStart();
  };

  const endControlsInteraction = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onInteractionEnd();
  };

  const handlePlaybackRateChange = (nextPlaybackRate: number) => {
    onInteraction();
    onPlaybackRateChange(nextPlaybackRate);
  };

  const handleSeek = (time: number) => {
    onInteraction();
    onSeek(time);
  };

  return (
    <div
      onClick={keepControlsVisible}
      onPointerCancel={endControlsInteraction}
      onPointerDown={startControlsInteraction}
      onPointerUp={endControlsInteraction}
      onTouchCancel={endControlsInteraction}
      onTouchEnd={endControlsInteraction}
      className={classNames(
        "absolute inset-x-0 bottom-0 z-20 px-3 py-2.5 text-white",
        "transition-opacity duration-200 ease-out sm:px-5 sm:py-3",
        isVisible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <PKVideoTimeline
        currentTime={currentTime}
        duration={duration}
        showTimeLabels={false}
        onInteraction={onInteraction}
        onInteractionEnd={onInteractionEnd}
        onInteractionStart={onInteractionStart}
        onSeek={handleSeek}
      />

      <div className={classNames("mt-2 flex items-center justify-between gap-2")}>
        <div className={classNames("flex min-w-0 items-center gap-1.5 sm:gap-2")}>
          <PKVideoControlButton
            label={isPlaying ? "Pause" : "Play"}
            onClick={onPlayToggle}
            className={classNames("bg-black/45 hover:bg-black/55")}
          >
            {isPlaying ? (
              <Pause className={classNames("size-[18px] fill-current stroke-[2.4]")} />
            ) : (
              <Play className={classNames("size-[18px] fill-current stroke-[2.4]")} />
            )}
          </PKVideoControlButton>

          <PKVideoControlButton
            label="Seek backward"
            onClick={() => onSeekBy(-PK_PLAYER_SEEK_SECONDS)}
            className={classNames("bg-black/45 hover:bg-black/55")}
          >
            <RotateCcw className={classNames("size-[18px] stroke-[2.4]")} />
          </PKVideoControlButton>

          <PKVideoControlButton
            label="Seek forward"
            onClick={() => onSeekBy(PK_PLAYER_SEEK_SECONDS)}
            className={classNames("bg-black/45 hover:bg-black/55")}
          >
            <RotateCw className={classNames("size-[18px] stroke-[2.4]")} />
          </PKVideoControlButton>

          <span
            className={classNames(
              "rounded-full bg-black/45 px-3 py-1.5 text-[11px]",
              "font-semibold tabular-nums text-white",
              "whitespace-nowrap",
              "sm:px-3.5 sm:text-sm",
            )}
          >
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </span>
        </div>

        <div
          className={classNames(
            "flex shrink-0 items-center gap-1 rounded-full",
            "bg-black/45 px-1 py-1 sm:gap-2 sm:px-2",
          )}
        >
          <PKVideoControlButton label="Mute" onClick={onMuteToggle}>
            {isMuted || volume === 0 ? (
              <VolumeX className={classNames("size-[18px] stroke-[2.4]")} />
            ) : (
              <Volume2 className={classNames("size-[18px] stroke-[2.4]")} />
            )}
          </PKVideoControlButton>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onBlur={onInteractionEnd}
            onClick={onInteraction}
            onFocus={onInteraction}
            onPointerCancel={onInteractionEnd}
            onPointerDown={onInteractionStart}
            onPointerMove={onInteraction}
            onPointerUp={onInteractionEnd}
            onChange={(event) => {
              onInteraction();
              onVolumeChange(Number(event.target.value));
            }}
            onTouchCancel={onInteractionEnd}
            onTouchEnd={onInteractionEnd}
            onTouchMove={onInteraction}
            onTouchStart={onInteractionStart}
            className={classNames("pk-player-range hidden w-20 sm:block lg:w-28")}
            style={volumeStyle}
            aria-label="Volume"
          />

          <PKVideoPlaybackSpeedMenu
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRateChange}
          />

          <PKVideoControlButton label="Fullscreen" onClick={onFullscreenToggle}>
            {isFullscreen ? (
              <Minimize className={classNames("size-[18px] stroke-[2.4]")} />
            ) : (
              <Maximize className={classNames("size-[18px] stroke-[2.4]")} />
            )}
          </PKVideoControlButton>
        </div>
      </div>
    </div>
  );
};
