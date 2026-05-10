"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, VideoOff } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { PKVideoPlayer } from "@/app/video-test/components/PKVideoPlayer";
import { PK_PLAYER_PROGRESS_STORAGE_PREFIX } from "@/constants/videoPlayer";
import type { ContentSourceProvider } from "@/constants/content";
import type { Content } from "@/types/content";

interface VideoPlayerModalProps {
  movie: Content;
  provider?: ContentSourceProvider;
  sourceUrl?: string;
}

const getAspectRatio = (movie: Content) => {
  const hasCustomAspect =
    Number.isFinite(movie.width) &&
    Number.isFinite(movie.height) &&
    (movie.width ?? 0) > 0 &&
    (movie.height ?? 0) > 0;

  if (!hasCustomAspect) {
    return undefined;
  }

  return `${movie.width}/${movie.height}`;
};

export const VideoPlayerModal = ({
  movie,
  provider,
  sourceUrl,
}: VideoPlayerModalProps) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const movieId = typeof params.id === "string" ? params.id : movie.id;
  const storageKey = `${PK_PLAYER_PROGRESS_STORAGE_PREFIX}${movieId}`;
  const aspectRatio = getAspectRatio(movie);

  const initialTime = (() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const storedTime = sessionStorage.getItem(storageKey);
    const parsedTime = storedTime ? Number(storedTime) : Number.NaN;

    if (Number.isFinite(parsedTime) && parsedTime > 0) {
      return parsedTime;
    }

    return undefined;
  })();

  const handleTimeUpdate = (time: number) => {
    if (!Number.isFinite(time) || time <= 0) {
      return;
    }

    sessionStorage.setItem(storageKey, time.toString());
  };

  const handleClose = () => {
    router.replace(`/movie/${movieId}`, { scroll: false });
  };
  const isS3Source = !!sourceUrl && provider === "S3";
  const sourceType = sourceUrl?.includes(".m3u8") ? "hls" : "mp4";

  return (
    <div className="h-screen z-50 bg-[#050505] text-white selection:bg-accent/40 overflow-hidden flex flex-col fixed uppercase w-full">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-accent/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Header  */}
      <header className="flex-none z-50 bg-linear-to-b from-black to-transparent p-4 flex items-center justify-center gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="p-2.5 lg:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md  rounded-2xl  text-white transition-all border border-white/5"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="hidden lg:flex flex-col">
          <h3 className="text-xs font-black tracking-tight text-white/90 truncate max-w-75">
            {movie.title}
          </h3>
          <p className="text-[8px] font-bold text-white/30 tracking-[0.2em]">
            Theater Mode
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative px-8 pb-8 transition-all duration-700 min-h-0 z-10">
        <div className="w-full h-full">
          <div
            className={classNames(
              "max-w-full max-h-full",
              "mx-auto rounded-3xl overflow-hidden",
              aspectRatio ? "" : "aspect-video",
              "relative shadow-[0_0_100px_rgba(229,9,20,0.1)]",
            )}
            style={aspectRatio ? { aspectRatio } : undefined}
          >
            {isS3Source ? (
              <PKVideoPlayer
                src={sourceUrl}
                sourceType={sourceType}
                poster={movie.backdropUrl}
                autoPlay
                initialTime={initialTime}
                onTimeUpdate={handleTimeUpdate}
              />
            ) : sourceUrl ? (
              <iframe
                src={sourceUrl}
                className={classNames("absolute inset-0 size-full border-0")}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
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
                  <h3
                    className={classNames(
                      "text-2xl lg:text-3xl font-black uppercase tracking-tighter mb-3",
                    )}
                  >
                    Video not found
                  </h3>
                  <p
                    className={classNames(
                      "text-ink-secondary text-sm max-w-sm mx-auto",
                    )}
                  >
                    This title does not have a playable video source yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
