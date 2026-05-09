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
  title: string;
  subtitle: string;
  src: string;
  sourceType: VideoSourceType;
  autoPlay?: boolean;
  showDetails?: boolean;
  poster?: string;
  tracks?: VideoTrack[];
}

export const PKVideoPlayer = ({
  title,
  subtitle,
  src,
  sourceType,
  autoPlay = false,
  showDetails = true,
  poster,
  tracks = [],
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
    <div className={classNames(showDetails ? "space-y-4" : "")}>
      <div
        ref={containerRef}
        tabIndex={0}
        onClick={toggleSurfacePlay}
        onPointerMove={showControlsFromPointer}
        onPointerLeave={hideControls}
        onPointerDown={focusPlayer}
        className={classNames(
          "relative overflow-hidden bg-black",
          isFullscreen
            ? "flex h-screen w-screen items-center justify-center rounded-none"
            : classNames(
                showDetails
                  ? "rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-white/10"
                  : "",
              ),
        )}
      >
        <div
          className={classNames(
            isFullscreen
              ? "flex h-screen w-screen items-center justify-center"
              : "w-full",
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
                  muted={autoPlay}
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
                  muted={autoPlay}
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

      {showDetails ? (
        <div className={classNames("space-y-2")}>
          <h1
            className={classNames(
              "text-xl font-black leading-tight text-white sm:text-2xl",
            )}
          >
            {title}
          </h1>
          <p className={classNames("text-sm text-white/50")}>{subtitle}</p>
        </div>
      ) : null}
    </div>
  );
};
