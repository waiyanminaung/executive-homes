"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createSerializer, parseAsString, useQueryState } from "nuqs";
import { X } from "lucide-react";
import { useWatchlist } from "@/components/@shared/useWatchlist";
import { ReportModal } from "@/app/movie/[id]/components";
import { WATCH_BACK_BUTTON_VISIBLE_MS } from "@/constants/videoPlayer";
import { useRead } from "@/lib/spoosh";
import type { Content, Episode } from "@/types/content";
import { classNames } from "@/utils/classNames";
import { RETURN_TO_QUERY_KEY } from "@/utils/navigationReturn";
import { VideoWatchBottomBar } from "./VideoWatchBottomBar";
import { VideoWatchPanel } from "./VideoWatchPanel";
import { VideoWatchPlayer } from "./VideoWatchPlayer";

export type VideoWatchTab = "info";

interface WatchSource {
  title: string;
  sourceUrl?: string;
  provider?: Episode["provider"];
  poster?: string;
  storageId: string;
}

const serializeMovieDetailSearchParams = createSerializer({
  [RETURN_TO_QUERY_KEY]: parseAsString,
});

const getActiveEpisode = (movie: Content, episodeId: string | null) => {
  const episodes = movie.seasons?.flatMap((season) => season.episodes) ?? [];

  return (
    episodes.find((episode) => episode.id === episodeId) ?? episodes.at(0)
  );
};

const getWatchSource = (
  movie: Content,
  episodeId: string | null,
): WatchSource => {
  if (movie.type === "series") {
    const episode = getActiveEpisode(movie, episodeId);

    return {
      title: episode ? `${movie.title} ${episode.title}` : movie.title,
      sourceUrl: episode?.sourceUrl,
      provider: episode?.provider,
      poster: episode?.posterUrl ?? movie.backdropUrl,
      storageId: episode?.id ?? movie.id,
    };
  }

  return {
    title: movie.title,
    sourceUrl: movie.sourceUrl,
    provider: movie.provider,
    poster: movie.backdropUrl,
    storageId: movie.id,
  };
};

export const VideoWatchPage = () => {
  const params = useParams<{ id: string }>();
  const movieId = typeof params.id === "string" ? params.id : "";
  const [episodeId] = useQueryState("episode", parseAsString);
  const [returnTo] = useQueryState(RETURN_TO_QUERY_KEY, parseAsString);
  const [activeTab, setActiveTab] = useState<VideoWatchTab | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBackButtonActive, setIsBackButtonActive] = useState(false);
  const backButtonIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const { data: movie, loading } = useRead(
    (api) => api("movies/:id").GET({ params: { id: movieId } }),
    { enabled: !!movieId },
  );
  const { toggle, isSaved } = useWatchlist();

  useEffect(() => {
    return () => {
      if (backButtonIdleTimeoutRef.current) {
        clearTimeout(backButtonIdleTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div
        className={classNames(
          "h-dvh bg-black flex items-center justify-center text-white",
        )}
      >
        <div
          className={classNames(
            "w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin",
          )}
        />
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        className={classNames(
          "h-dvh bg-black flex items-center justify-center px-6 text-center",
          "text-white/30 text-xs font-black uppercase tracking-[0.25em]",
        )}
      >
        Video not found
      </div>
    );
  }

  const source = getWatchSource(movie, episodeId);
  const isInWatchlist = isSaved(movie.id);
  const movieDetailHref = serializeMovieDetailSearchParams(
    `/movie/${movie.id}`,
    {
      returnTo,
    },
  );

  const toggleActiveTab = (tab: VideoWatchTab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleVideoAreaMouseMove = () => {
    if (!isBackButtonActive) {
      setIsBackButtonActive(true);
    }

    if (backButtonIdleTimeoutRef.current) {
      clearTimeout(backButtonIdleTimeoutRef.current);
    }

    backButtonIdleTimeoutRef.current = setTimeout(() => {
      setIsBackButtonActive(false);
    }, WATCH_BACK_BUTTON_VISIBLE_MS);
  };

  return (
    <div
      className={classNames(
        "h-dvh w-full overflow-hidden bg-black text-white flex flex-col",
        "selection:bg-accent/40",
      )}
    >
      <ReportModal
        isOpen={isReportOpen}
        title={source.title}
        onClose={() => setIsReportOpen(false)}
      />

      <main
        className={classNames("relative min-h-0 flex-1 bg-black")}
        onMouseMove={handleVideoAreaMouseMove}
      >
        <VideoWatchPlayer
          key={source.storageId}
          sourceUrl={source.sourceUrl}
          provider={source.provider}
          poster={source.poster}
          storageId={source.storageId}
        />

        <Link
          href={movieDetailHref}
          className={classNames(
            "absolute left-4 top-4 z-20 size-11 rounded-full",
            "border border-white/10 bg-black/45 text-white backdrop-blur-md",
            "flex items-center justify-center",
            isBackButtonActive ? "opacity-100" : "opacity-45",
            "transition-all hover:bg-white/10 hover:opacity-100",
            "focus-visible:opacity-100 active:scale-95",
            "lg:left-8 lg:top-8 lg:size-12",
          )}
          aria-label="Close"
        >
          <X className={classNames("size-5")} />
        </Link>
      </main>

      <VideoWatchPanel activeTab={activeTab} movie={movie} />

      <VideoWatchBottomBar
        title={source.title}
        activeTab={activeTab}
        isInWatchlist={isInWatchlist}
        onReport={() => setIsReportOpen(true)}
        onToggleWatchlist={() => toggle(movie)}
        onToggleTab={toggleActiveTab}
      />
    </div>
  );
};
