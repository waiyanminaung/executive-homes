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
import { PKVideoTimeline } from "./PKVideoTimeline";

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
  onMuteToggle,
  onPlaybackRateChange,
  onVolumeChange,
}: PKVideoPlayerControlsProps) => {
  const volumeProgress = isMuted ? 0 : volume * 100;
  const volumeStyle: RangeStyle = {
    "--pk-range-active-color": "#ffffff",
    "--pk-range-progress": `${volumeProgress}%`,
  };

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className={classNames(
        "absolute bottom-4 left-1/2 z-20 w-[min(30rem,calc(100%-2rem))]",
        "-translate-x-1/2 rounded-xl bg-[#2f2e2a]/82 px-4 py-2.5",
        "text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
        "ring-1 ring-white/10 backdrop-blur-md",
        "transition-opacity duration-200 ease-out",
        isVisible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        className={classNames(
          "mb-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
          "items-center gap-2",
        )}
      >
        <div className={classNames("flex min-w-0 items-center gap-2 justify-self-start")}>
          <PKVideoControlButton label="Mute" onClick={onMuteToggle}>
            {isMuted || volume === 0 ? (
              <VolumeX className={classNames("size-[18px] stroke-[2.5]")} />
            ) : (
              <Volume2 className={classNames("size-[18px] stroke-[2.5]")} />
            )}
          </PKVideoControlButton>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className={classNames("pk-player-range hidden w-16 sm:block")}
            style={volumeStyle}
            aria-label="Volume"
          />
        </div>

        <div className={classNames("flex items-center justify-center gap-3")}>
          <PKVideoControlButton
            label="Seek backward"
            onClick={() => onSeekBy(-PK_PLAYER_SEEK_SECONDS)}
          >
            <RotateCcw className={classNames("size-[18px] stroke-[2.5]")} />
          </PKVideoControlButton>

          <PKVideoControlButton
            label="Play"
            size="lg"
            onClick={onPlayToggle}
          >
            {isPlaying ? (
              <Pause className={classNames("size-6 fill-current stroke-[2.4]")} />
            ) : (
              <Play className={classNames("size-6 fill-current stroke-[2.4]")} />
            )}
          </PKVideoControlButton>

          <PKVideoControlButton
            label="Seek forward"
            onClick={() => onSeekBy(PK_PLAYER_SEEK_SECONDS)}
          >
            <RotateCw className={classNames("size-[18px] stroke-[2.5]")} />
          </PKVideoControlButton>
        </div>

        <div className={classNames("flex items-center gap-1.5 justify-self-end")}>
          <PKVideoControlButton
            label="Fullscreen"
            onClick={onFullscreenToggle}
          >
            {isFullscreen ? (
              <Minimize className={classNames("size-[18px] stroke-[2.4]")} />
            ) : (
              <Maximize className={classNames("size-[18px] stroke-[2.4]")} />
            )}
          </PKVideoControlButton>

          <PKVideoPlaybackSpeedMenu
            playbackRate={playbackRate}
            onPlaybackRateChange={onPlaybackRateChange}
          />
        </div>
      </div>

      <PKVideoTimeline currentTime={currentTime} duration={duration} onSeek={onSeek} />
    </div>
  );
};
