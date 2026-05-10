"use client";

import { HlsVideo } from "@videojs/react/media/hls-video";
import { Video } from "@videojs/react/video";
import { classNames } from "@/utils/classNames";

export type VideoSourceType = "hls" | "mp4";

export interface VideoTrack {
  src: string;
  label: string;
  srcLang: string;
  kind?: "subtitles" | "captions";
  default?: boolean;
}

interface PKVideoPlayerMediaProps {
  src: string;
  sourceType: VideoSourceType;
  autoPlay: boolean;
  muted: boolean;
  poster?: string;
  tracks: VideoTrack[];
}

export const PKVideoPlayerMedia = ({
  src,
  sourceType,
  autoPlay,
  muted,
  poster,
  tracks,
}: PKVideoPlayerMediaProps) => {
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

  const mediaProps = {
    src,
    poster,
    autoPlay,
    muted,
    playsInline: true,
    preload: autoPlay ? "auto" : "metadata",
    crossOrigin: "anonymous",
    className: classNames("size-full object-contain"),
  } as const;

  if (sourceType === "hls") {
    return <HlsVideo {...mediaProps}>{mediaTracks}</HlsVideo>;
  }

  return <Video {...mediaProps}>{mediaTracks}</Video>;
};
