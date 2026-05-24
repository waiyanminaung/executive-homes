"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Hotkey,
  selectControls,
  selectFullscreen,
  selectPlayback,
} from "@videojs/react";
import { Spinner } from "@geckoui/geckoui";
import { Pause, Play } from "lucide-react";
import type {
  WatchPartyPlaybackState,
  WatchPartyPlaybackStatus,
} from "@/types/watchParty";
import {
  PK_PLAYER_CENTER_FEEDBACK_MS,
  PK_PLAYER_SEEK_SECONDS,
} from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";
import { PKVideoPlayerBridges } from "./PKVideoPlayerBridges";
import { PKVideoPlayerControls } from "./PKVideoPlayerControls";
import { Player } from "./PKVideoPlayerInstance";
import {
  PKVideoPlayerMedia,
  type VideoSourceType,
  type VideoTrack,
} from "./PKVideoPlayerMedia";
import { hasInitialTime } from "./useInitialResumeSeek";

type CenterFeedback = "pause" | "play" | null;

interface PKVideoPlayerProps {
  src: string;
  sourceType: VideoSourceType;
  autoPlay?: boolean;
  muted?: boolean;
  initialTime?: number;
  onPlaybackStateChange?: (state: {
    currentTime: number;
    status: WatchPartyPlaybackStatus;
  }) => void;
  onTimeUpdate?: (time: number) => void;
  poster?: string;
  syncState?: WatchPartyPlaybackState | null;
  tracks?: VideoTrack[];
  containerClassName?: string;
}

const PKVideoPlayerContent = ({
  src,
  sourceType,
  autoPlay = false,
  muted = false,
  initialTime,
  onPlaybackStateChange,
  onTimeUpdate,
  poster,
  syncState,
  tracks = [],
  containerClassName,
}: PKVideoPlayerProps) => {
  const controls = Player.usePlayer(selectControls);
  const fullscreen = Player.usePlayer(selectFullscreen);
  const playback = Player.usePlayer(selectPlayback);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerTypeRef = useRef<PointerEvent["pointerType"] | null>(null);
  const touchControlsVisibleRef = useRef<boolean | null>(null);
  const initialTimeRef = useRef(initialTime);
  const [centerFeedback, setCenterFeedback] = useState<CenterFeedback>(null);
  const [isResumePending, setIsResumePending] = useState(() =>
    hasInitialTime(initialTime),
  );

  const fullscreenVideoStyle = fullscreen?.fullscreen
    ? {
        height: "min(100vh, calc(100vw * 9 / 16))",
        width: "min(100vw, calc(100vh * 16 / 9))",
      }
    : undefined;
  const centerControlFeedback =
    centerFeedback ?? (playback?.paused ? "play" : "pause");
  const isCenterFeedbackVisible =
    !isResumePending &&
    (!!centerFeedback || (controls?.controlsVisible && !playback?.started));
  const isVideoLoading = !!playback?.waiting || isResumePending;

  const showCenterFeedback = (feedback: Exclude<CenterFeedback, null>) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setCenterFeedback(feedback);
    feedbackTimeoutRef.current = setTimeout(() => {
      setCenterFeedback(null);
    }, PK_PLAYER_CENTER_FEEDBACK_MS);
  };

  const handleSurfaceClick = () => {
    if (!playback) {
      return;
    }

    if (pointerTypeRef.current === "touch") {
      const wereControlsVisible =
        touchControlsVisibleRef.current ?? controls?.controlsVisible;

      if (!wereControlsVisible) {
        if (controls && !controls.controlsVisible) {
          controls.toggleControls();
        }

        return;
      }
    }

    showCenterFeedback(playback.paused ? "pause" : "play");
    playback.togglePaused();
  };

  const handleSurfacePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerTypeRef.current = event.pointerType;

    if (event.pointerType === "touch") {
      touchControlsVisibleRef.current = controls?.controlsVisible ?? null;
    }
  };

  useEffect(() => {
    if (initialTimeRef.current === initialTime) {
      return;
    }

    initialTimeRef.current = initialTime;
    setIsResumePending(hasInitialTime(initialTime));
  }, [initialTime]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Player.Container
      tabIndex={0}
      style={fullscreenVideoStyle}
      onClick={handleSurfaceClick}
      onPointerDown={handleSurfacePointerDown}
      className={classNames(
        "relative h-full bg-black",
        fullscreen?.fullscreen &&
          "flex h-screen w-screen items-center justify-center",
        containerClassName,
      )}
    >
      <PKVideoPlayerMedia
        src={src}
        sourceType={sourceType}
        autoPlay={autoPlay}
        muted={muted}
        poster={poster}
        tracks={tracks}
      />

      <PKVideoPlayerBridges
        initialTime={initialTime}
        isResumePending={isResumePending}
        onPlaybackStateChange={onPlaybackStateChange}
        onResumePendingChange={setIsResumePending}
        onTimeUpdate={onTimeUpdate}
        syncState={syncState}
      />
      <Hotkey
        keys="ArrowLeft"
        action="seekStep"
        value={-PK_PLAYER_SEEK_SECONDS}
        target="player"
      />
      <Hotkey
        keys="ArrowRight"
        action="seekStep"
        value={PK_PLAYER_SEEK_SECONDS}
        target="player"
      />

      <div
        className={classNames(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
          "transition-opacity duration-200 ease-out",
          isCenterFeedbackVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={classNames(
            "flex size-16 items-center justify-center rounded-full",
            "bg-black/45 text-white",
          )}
        >
          {centerControlFeedback === "pause" ? (
            <Pause className={classNames("size-8 fill-current")} />
          ) : (
            <Play className={classNames("size-8 fill-current")} />
          )}
        </div>
      </div>

      <div
        aria-live="polite"
        className={classNames(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
          "transition-opacity duration-200 ease-out",
          isVideoLoading ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={classNames(
            "flex size-14 items-center justify-center rounded-full",
            "bg-black/45 text-white backdrop-blur-sm",
          )}
        >
          <Spinner className={classNames("size-7")} />
        </div>
      </div>

      <PKVideoPlayerControls />
    </Player.Container>
  );
};

export const PKVideoPlayer = (props: PKVideoPlayerProps) => {
  return (
    <Player.Provider>
      <PKVideoPlayerContent {...props} />
    </Player.Provider>
  );
};
