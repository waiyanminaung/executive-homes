"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, VideoOff } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { PKVideoPlayer } from "@/app/video-test/components/PKVideoPlayer";
import type { ContentSourceProvider } from "@/constants/content";
import type { Content } from "@/types/content";

interface VideoPlayerModalProps {
  movie: Content;
  provider?: ContentSourceProvider;
  sourceUrl?: string;
}

export const VideoPlayerModal = ({
  movie,
  provider,
  sourceUrl,
}: VideoPlayerModalProps) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const movieId = typeof params.id === "string" ? params.id : movie.id;

  const handleClose = () => {
    router.replace(`/movie/${movieId}`, { scroll: false });
  };
  const isS3Source = !!sourceUrl && provider === "S3";
  const sourceType = sourceUrl?.includes(".m3u8") ? "hls" : "mp4";

  return (
    <div
      className={classNames(
        "fixed inset-0 z-[300] bg-black flex flex-col",
        "items-center justify-center p-4 lg:p-10",
      )}
    >
      <div
        className={classNames(
          "absolute top-6 lg:top-8 left-6 lg:left-8 z-[310]",
          "flex items-center gap-3 lg:gap-4",
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className={classNames(
            "p-2.5 lg:p-3 bg-white/10 hover:bg-white/20",
            "backdrop-blur-md rounded-full text-white transition-all",
            "border border-white/5",
          )}
          aria-label="Close video player"
        >
          <ArrowLeft className={classNames("w-5 h-5 lg:w-6 lg:h-6")} />
        </button>
      </div>

      <div
        className={classNames(
          "relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden",
          isS3Source ? "" : "h-full",
          "border border-white/5 shadow-[0_0_100px_rgba(229,9,20,0.1)]",
        )}
      >
        {isS3Source ? (
          <div className={classNames("w-full bg-black")}>
            <PKVideoPlayer
              title={movie.title}
              subtitle={provider}
              src={sourceUrl}
              sourceType={sourceType}
              poster={movie.backdropUrl}
              autoPlay
              showDetails={false}
            />
          </div>
        ) : sourceUrl ? (
          <iframe
            src={sourceUrl}
            className={classNames("w-full h-full border-0")}
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
  );
};
