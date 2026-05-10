"use client";

import {
  Controls,
  FullscreenButton,
  MuteButton,
  PlayButton,
  SeekButton,
  Time,
  TimeSlider,
  VolumeSlider,
} from "@videojs/react";
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

export const PKVideoPlayerControls = () => {
  return (
    <Controls.Root
      onClick={(event) => event.stopPropagation()}
      className={classNames(
        "pk-video-controls absolute inset-x-0 bottom-0 z-20 px-3 py-2.5 text-white",
        "transition-opacity duration-200 ease-out sm:px-5 sm:py-3",
      )}
    >
      <TimeSlider.Root className={classNames("pk-video-slider w-full")}>
        <TimeSlider.Track className={classNames("pk-video-slider__track")}>
          <TimeSlider.Buffer className={classNames("pk-video-slider__buffer")} />
          <TimeSlider.Fill className={classNames("pk-video-slider__fill")} />
        </TimeSlider.Track>
        <TimeSlider.Thumb className={classNames("pk-video-slider__thumb")} />
      </TimeSlider.Root>

      <div
        className={classNames("mt-2 flex items-center justify-between gap-2")}
      >
        <div
          className={classNames("flex min-w-0 items-center gap-1.5 sm:gap-2")}
        >
          <PlayButton
            className={classNames("bg-black/45 hover:bg-black/55")}
            render={(props, state) => (
              <PKVideoControlButton {...props}>
                {state.paused ? (
                  <Play
                    className={classNames(
                      "size-4.5 fill-current stroke-[2.4]",
                    )}
                  />
                ) : (
                  <Pause
                    className={classNames(
                      "size-4.5 fill-current stroke-[2.4]",
                    )}
                  />
                )}
              </PKVideoControlButton>
            )}
          />

          <SeekButton
            seconds={-PK_PLAYER_SEEK_SECONDS}
            className={classNames("bg-black/45 hover:bg-black/55")}
            render={(props) => (
              <PKVideoControlButton {...props}>
                <RotateCcw className={classNames("size-4.5 stroke-[2.4]")} />
              </PKVideoControlButton>
            )}
          />

          <SeekButton
            seconds={PK_PLAYER_SEEK_SECONDS}
            className={classNames("bg-black/45 hover:bg-black/55")}
            render={(props) => (
              <PKVideoControlButton {...props}>
                <RotateCw className={classNames("size-4.5 stroke-[2.4]")} />
              </PKVideoControlButton>
            )}
          />

          <Time.Group
            className={classNames(
              "rounded-full bg-black/45 px-3 py-1.5 text-[11px]",
              "font-semibold tabular-nums text-white",
              "whitespace-nowrap",
              "sm:px-3.5 sm:text-sm",
            )}
          >
            <Time.Value />
            <span className={classNames("px-1 text-white/65")}>/</span>
            <Time.Value type="duration" />
          </Time.Group>
        </div>

        <div
          className={classNames(
            "flex shrink-0 items-center gap-1 rounded-full",
            "bg-black/45 px-1 py-1 sm:gap-2 sm:px-2",
          )}
        >
          <MuteButton
            render={(props, state) => (
              <PKVideoControlButton {...props}>
                {state.muted || state.volumeLevel === "off" ? (
                  <VolumeX className={classNames("size-4.5 stroke-[2.4]")} />
                ) : (
                  <Volume2 className={classNames("size-4.5 stroke-[2.4]")} />
                )}
              </PKVideoControlButton>
            )}
          />

          <VolumeSlider.Root
            className={classNames(
              "pk-video-slider pk-video-volume-slider hidden w-20 sm:flex lg:w-28",
            )}
          >
            <VolumeSlider.Track
              className={classNames("pk-video-slider__track")}
            >
              <VolumeSlider.Fill
                className={classNames("pk-video-slider__fill")}
              />
            </VolumeSlider.Track>
            <VolumeSlider.Thumb
              className={classNames("pk-video-slider__thumb")}
            />
          </VolumeSlider.Root>

          <PKVideoPlaybackSpeedMenu />

          <FullscreenButton
            render={(props, state) => (
              <PKVideoControlButton {...props}>
                {state.fullscreen ? (
                  <Minimize className={classNames("size-4.5 stroke-[2.4]")} />
                ) : (
                  <Maximize className={classNames("size-4.5 stroke-[2.4]")} />
                )}
              </PKVideoControlButton>
            )}
          />
        </div>
      </div>
    </Controls.Root>
  );
};
