"use client";

import { useState } from "react";
import { VideoOff } from "lucide-react";
import { PKVideoPlayer } from "@/app/video-test/components/PKVideoPlayer";
import { PK_PLAYER_PROGRESS_STORAGE_PREFIX } from "@/constants/videoPlayer";
import type { ContentSourceProvider } from "@/constants/content";
import type {
  WatchPartyPlaybackState,
  WatchPartyPlaybackStatus,
} from "@/types/watchParty";
import { classNames } from "@/utils/classNames";

interface MoviePlayerProps {
  isInteractionLocked?: boolean;
  onPlaybackStateChange?: (state: {
    currentTime: number;
    status: WatchPartyPlaybackStatus;
  }) => void;
  poster?: string;
  provider?: ContentSourceProvider;
  sourceUrl?: string;
  storageId: string;
  syncState?: WatchPartyPlaybackState | null;
}

const getInitialTime = (storageKey: string) => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const storedTime = sessionStorage.getItem(storageKey);
  const parsedTime = storedTime ? Number(storedTime) : Number.NaN;

  if (Number.isFinite(parsedTime) && parsedTime > 0) {
    return parsedTime;
  }

  return undefined;
};

export const MoviePlayer = ({
  isInteractionLocked = false,
  onPlaybackStateChange,
  poster,
  provider,
  sourceUrl,
  storageId,
  syncState,
}: MoviePlayerProps) => {
  const storageKey = `${PK_PLAYER_PROGRESS_STORAGE_PREFIX}${storageId}`;
  const [initialTime] = useState(() => getInitialTime(storageKey));
  const isS3Source = !!sourceUrl && provider === "S3";
  const sourceType = sourceUrl?.includes(".m3u8") ? "hls" : "mp4";

  const handleTimeUpdate = (time: number) => {
    if (!Number.isFinite(time) || time <= 0) {
      return;
    }

    sessionStorage.setItem(storageKey, time.toString());
  };

  if (isS3Source) {
    return (
      <div className={classNames("relative size-full")}>
        <PKVideoPlayer
          src={sourceUrl}
          sourceType={sourceType}
          poster={poster}
          autoPlay
          initialTime={initialTime}
          onPlaybackStateChange={onPlaybackStateChange}
          onTimeUpdate={handleTimeUpdate}
          syncState={syncState}
          containerClassName={classNames("size-full")}
        />

        {isInteractionLocked ? (
          <div
            className={classNames(
              "absolute inset-0 z-30 flex items-end justify-center bg-transparent",
            )}
          >
            <div
              className={classNames(
                "mb-28 rounded-full border border-white/10 bg-black/60 px-4 py-2",
                "text-[10px] font-black uppercase tracking-[0.2em] text-white/75",
                "backdrop-blur-sm",
              )}
            >
              Host controls playback
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (sourceUrl) {
    return (
      <iframe
        src={sourceUrl}
        className={classNames("absolute inset-0 size-full border-0 bg-black")}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className={classNames(
        "absolute inset-0 bg-[#050505] flex items-center justify-center",
      )}
    >
      <div className={classNames("relative z-10 text-center px-6")}>
        <div
          className={classNames(
            "w-20 h-20 bg-white/5 rounded-full flex items-center",
            "justify-center mx-auto mb-6 text-white/30",
          )}
        >
          <VideoOff className={classNames("w-9 h-9")} />
        </div>
        <h1
          className={classNames(
            "text-2xl lg:text-3xl font-black uppercase tracking-tight mb-3",
          )}
        >
          Video not found
        </h1>
        <p
          className={classNames(
            "text-ink-secondary text-sm max-w-sm mx-auto leading-relaxed",
          )}
        >
          This title does not have a playable video source yet.
        </p>
      </div>
    </div>
  );
};
