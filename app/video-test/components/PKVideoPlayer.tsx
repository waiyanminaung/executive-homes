"use client";

import { createPlayer } from "@videojs/react";
import { HlsVideo } from "@videojs/react/media/hls-video";
import { Video, videoFeatures } from "@videojs/react/video";
import { Spinner } from "@geckoui/geckoui";
import { Pause, Play } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { PKVideoPlayerControls } from "./PKVideoPlayerControls";
import { usePKVideoPlayer } from "./usePKVideoPlayer";

const Player = createPlayer({ features: videoFeatures });

type VideoSourceType = "hls" | "mp4";

interface VideoTrack {
  src: string;
  label: string;
  srcLang: string;
  kind?: "subtitles" | "captions";
  default?: boolean;
}

interface PKVideoPlayerProps {
  src: string;
  sourceType: VideoSourceType;
  autoPlay?: boolean;
  muted?: boolean;
  poster?: string;
  tracks?: VideoTrack[];
  containerClassName?: string;
}

export const PKVideoPlayer = ({
  src,
  sourceType,
  autoPlay = false,
  muted = false,
  poster,
  tracks = [],
  containerClassName,
}: PKVideoPlayerProps) => {
  const {
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
  } = usePKVideoPlayer();

  const mediaTracks = tracks.map((track) => (
    <track
      key={track.src}
      src={track.src}
      label={track.label}
      srcLang={track.srcLang}
      kind={track.kind ?? "subtitles"}
      default={track.default}
    />
  ));

  const fullscreenVideoStyle = isFullscreen
    ? {
        height: "min(100vh, calc(100vw * 9 / 16))",
        width: "min(100vw, calc(100vh * 16 / 9))",
      }
    : undefined;
  const centerControlFeedback =
    centerFeedback ?? (isPlaying ? "pause" : "play");

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={toggleSurfacePlay}
      onPointerMove={showControlsFromPointer}
      onPointerLeave={hideControls}
      onPointerDown={focusPlayer}
      className={classNames(
        "relative h-full overflow-hidden bg-black",
        isFullscreen && "flex h-screen w-screen items-center justify-center",
        containerClassName,
      )}
    >
      <div
        className={classNames(
          isFullscreen
            ? "flex h-screen w-screen items-center justify-center"
            : "h-full w-full",
        )}
      >
        <Player.Provider>
          <Player.Container
            style={fullscreenVideoStyle}
            className={classNames(
              "relative bg-black",
              isFullscreen ? "" : "size-full",
            )}
          >
            {sourceType === "hls" ? (
              <HlsVideo
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                playsInline
                preload={autoPlay ? "auto" : "metadata"}
                crossOrigin="anonymous"
                className={classNames("size-full object-contain")}
              >
                {mediaTracks}
              </HlsVideo>
            ) : (
              <Video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                playsInline
                preload={autoPlay ? "auto" : "metadata"}
                crossOrigin="anonymous"
                className={classNames("size-full object-contain")}
              >
                {mediaTracks}
              </Video>
            )}
          </Player.Container>
        </Player.Provider>
      </div>

      <div
        className={classNames(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
          "transition-opacity duration-200 ease-out",
          centerFeedback
            ? "opacity-100"
            : isControlsVisible
              ? "opacity-100 sm:opacity-0"
              : "opacity-0",
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

      <PKVideoPlayerControls
        currentTime={currentTime}
        duration={duration}
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        isPlaying={isPlaying}
        isVisible={isControlsVisible}
        playbackRate={playbackRate}
        volume={volume}
        onPlayToggle={togglePlay}
        onSeek={seekTo}
        onSeekBy={seekBy}
        onFullscreenToggle={toggleFullscreen}
        onInteractionEnd={endControlsInteraction}
        onInteractionStart={startControlsInteraction}
        onInteraction={showControls}
        onMuteToggle={toggleMute}
        onPlaybackRateChange={updatePlaybackRate}
        onVolumeChange={updateVolume}
      />
    </div>
  );
};
