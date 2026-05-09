"use client";

import { useEffect, useRef, useState } from "react";
import {
  PK_PLAYER_CENTER_FEEDBACK_MS,
  PK_PLAYER_CONTROLS_HIDE_DELAY_MS,
  PK_PLAYER_CONTROLS_LEAVE_HIDE_DELAY_MS,
  PK_PLAYER_DEFAULT_VOLUME,
  PK_PLAYER_KEYBOARD_OUTSIDE_CONTROLS_HIDE_DELAY_MS,
  PK_PLAYER_LOADING_INDICATOR_DELAY_MS,
  PK_PLAYER_READY_STATE_HAVE_FUTURE_DATA,
  PK_PLAYER_SEEK_SECONDS,
} from "@/constants/videoPlayer";

type CenterFeedback = "pause" | "play" | null;

type KeyboardSeekEvent = {
  key: string;
  preventDefault: () => void;
  target: EventTarget | null;
};

const getKeyboardSeekSeconds = (key: string) => {
  switch (key) {
    case "ArrowLeft":
      return -PK_PLAYER_SEEK_SECONDS;
    case "ArrowRight":
      return PK_PLAYER_SEEK_SECONDS;
    default:
      return null;
  }
};

const isInteractiveKeyboardTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input,select,textarea") || target.isContentEditable,
  );
};

export const usePKVideoPlayer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlsInteractionActiveRef = useRef(false);
  const isPointerInsidePlayerRef = useRef(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialControlsWindowRef = useRef(true);
  const [centerFeedback, setCenterFeedback] = useState<CenterFeedback>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(PK_PLAYER_DEFAULT_VOLUME);

  const clearControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const clearLeaveTimeout = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
  };

  const scheduleControlsHide = (delay = PK_PLAYER_CONTROLS_HIDE_DELAY_MS) => {
    clearControlsTimeout();
    clearLeaveTimeout();
    controlsTimeoutRef.current = setTimeout(() => {
      isInitialControlsWindowRef.current = false;
      setIsControlsVisible(false);
    }, delay);
  };

  const showControls = () => {
    setIsControlsVisible(true);
    scheduleControlsHide();
  };

  const startControlsInteraction = () => {
    isControlsInteractionActiveRef.current = true;
    setIsControlsVisible(true);
    clearControlsTimeout();
    clearLeaveTimeout();
  };

  const endControlsInteraction = () => {
    isControlsInteractionActiveRef.current = false;
    showControls();
  };

  const showControlsFromPointer = () => {
    isPointerInsidePlayerRef.current = true;
    showControls();
  };

  const showCenterFeedback = (feedback: Exclude<CenterFeedback, null>) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setCenterFeedback(feedback);
    feedbackTimeoutRef.current = setTimeout(() => {
      setCenterFeedback(null);
    }, PK_PLAYER_CENTER_FEEDBACK_MS);
  };

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      if (video.readyState < PK_PLAYER_READY_STATE_HAVE_FUTURE_DATA) {
        setIsVideoLoading(true);
      }

      setIsPlaying(true);
      void video.play().catch(() => {
        setIsPlaying(false);
        setIsVideoLoading(false);
      });
      return;
    }

    video.pause();
    setIsPlaying(false);
    setIsVideoLoading(false);
  };

  const toggleSurfacePlay = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    showControls();

    if (video.paused) {
      showCenterFeedback("pause");
    } else {
      showCenterFeedback("play");
    }

    togglePlay();
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = time;
    setCurrentTime(time);
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    seekTo(Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0));
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const updateVolume = (nextVolume: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setIsMuted(video.muted);
  };

  const updatePlaybackRate = (nextPlaybackRate: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.playbackRate = nextPlaybackRate;
    setPlaybackRate(nextPlaybackRate);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void containerRef.current?.requestFullscreen();
  };

  const hideControls = () => {
    isPointerInsidePlayerRef.current = false;

    if (isInitialControlsWindowRef.current || isControlsInteractionActiveRef.current) {
      return;
    }

    clearControlsTimeout();
    clearLeaveTimeout();
    leaveTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, PK_PLAYER_CONTROLS_LEAVE_HIDE_DELAY_MS);
  };

  const focusPlayer = () => {
    containerRef.current?.focus();
    showControls();
  };

  useEffect(() => {
    controlsTimeoutRef.current = setTimeout(() => {
      isInitialControlsWindowRef.current = false;
      setIsControlsVisible(false);
    }, PK_PLAYER_CONTROLS_HIDE_DELAY_MS);

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }

      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }

      if (videoLoadingTimeoutRef.current) {
        clearTimeout(videoLoadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.volume = PK_PLAYER_DEFAULT_VOLUME;

    const clearVideoLoadingTimeout = () => {
      if (videoLoadingTimeoutRef.current) {
        clearTimeout(videoLoadingTimeoutRef.current);
        videoLoadingTimeoutRef.current = null;
      }
    };
    const updatePlaybackState = () => setIsPlaying(!video.paused);
    const updateDuration = () => setDuration(video.duration || 0);
    const updatePlaybackRateState = () => setPlaybackRate(video.playbackRate);
    const showVideoLoading = () => {
      clearVideoLoadingTimeout();
      videoLoadingTimeoutRef.current = setTimeout(() => {
        const currentVideo = videoRef.current;

        if (
          currentVideo &&
          currentVideo.readyState < PK_PLAYER_READY_STATE_HAVE_FUTURE_DATA
        ) {
          setIsVideoLoading(true);
        }
      }, PK_PLAYER_LOADING_INDICATOR_DELAY_MS);
    };
    const hideVideoLoading = () => {
      clearVideoLoadingTimeout();
      setIsVideoLoading(false);
    };
    const updateTime = () => {
      setCurrentTime(video.currentTime);
      hideVideoLoading();
    };
    const updateVolumeState = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("loadstart", showVideoLoading);
    video.addEventListener("waiting", showVideoLoading);
    video.addEventListener("stalled", showVideoLoading);
    video.addEventListener("seeking", showVideoLoading);
    video.addEventListener("loadeddata", hideVideoLoading);
    video.addEventListener("canplay", hideVideoLoading);
    video.addEventListener("playing", hideVideoLoading);
    video.addEventListener("pause", hideVideoLoading);
    video.addEventListener("seeked", hideVideoLoading);
    video.addEventListener("error", hideVideoLoading);
    video.addEventListener("play", updatePlaybackState);
    video.addEventListener("pause", updatePlaybackState);
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ratechange", updatePlaybackRateState);
    video.addEventListener("volumechange", updateVolumeState);

    if (video.readyState >= PK_PLAYER_READY_STATE_HAVE_FUTURE_DATA) {
      setIsVideoLoading(false);
    }

    return () => {
      clearVideoLoadingTimeout();
      video.removeEventListener("loadstart", showVideoLoading);
      video.removeEventListener("waiting", showVideoLoading);
      video.removeEventListener("stalled", showVideoLoading);
      video.removeEventListener("seeking", showVideoLoading);
      video.removeEventListener("loadeddata", hideVideoLoading);
      video.removeEventListener("canplay", hideVideoLoading);
      video.removeEventListener("playing", hideVideoLoading);
      video.removeEventListener("pause", hideVideoLoading);
      video.removeEventListener("seeked", hideVideoLoading);
      video.removeEventListener("error", hideVideoLoading);
      video.removeEventListener("play", updatePlaybackState);
      video.removeEventListener("pause", updatePlaybackState);
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ratechange", updatePlaybackRateState);
      video.removeEventListener("volumechange", updateVolumeState);
    };
  }, []);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
    };
  }, []);

  useEffect(() => {
    const handleKeyboardSeek = (event: KeyboardSeekEvent) => {
      const video = videoRef.current;
      const seekSeconds = getKeyboardSeekSeconds(event.key);

      if (!video || video.paused || seekSeconds === null) {
        return;
      }

      if (isInteractiveKeyboardTarget(event.target)) {
        return;
      }

      event.preventDefault();

      const nextTime = Math.min(
        Math.max(video.currentTime + seekSeconds, 0),
        video.duration || 0,
      );
      const hideDelay = isPointerInsidePlayerRef.current
        ? PK_PLAYER_CONTROLS_HIDE_DELAY_MS
        : PK_PLAYER_KEYBOARD_OUTSIDE_CONTROLS_HIDE_DELAY_MS;

      video.currentTime = nextTime;
      setCurrentTime(nextTime);
      setIsControlsVisible(true);
      clearControlsTimeout();
      clearLeaveTimeout();
      controlsTimeoutRef.current = setTimeout(() => {
        isInitialControlsWindowRef.current = false;
        setIsControlsVisible(false);
      }, hideDelay);
    };

    document.addEventListener("keydown", handleKeyboardSeek);

    return () => {
      document.removeEventListener("keydown", handleKeyboardSeek);
    };
  }, []);

  return {
    centerFeedback,
    containerRef,
    currentTime,
    duration,
    focusPlayer,
    hideControls,
    isControlsVisible,
    isFullscreen,
    isMuted,
    isPlaying,
    isVideoLoading,
    playbackRate,
    seekBy,
    seekTo,
    showControls,
    showControlsFromPointer,
    startControlsInteraction,
    toggleFullscreen,
    toggleMute,
    togglePlay,
    toggleSurfacePlay,
    endControlsInteraction,
    updateVolume,
    updatePlaybackRate,
    videoRef,
    volume,
  };
};
