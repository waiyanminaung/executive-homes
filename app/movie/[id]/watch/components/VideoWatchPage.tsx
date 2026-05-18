"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSerializer, parseAsString, useQueryState } from "nuqs";
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
  time: string;
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
      time: episode?.duration ?? `${movie.year}`,
      sourceUrl: episode?.sourceUrl,
      provider: episode?.provider,
      poster: episode?.posterUrl ?? movie.backdropUrl,
      storageId: episode?.id ?? movie.id,
    };
  }

  return {
    title: movie.title,
    time: movie.duration ?? `${movie.year}`,
    sourceUrl: movie.sourceUrl,
    provider: movie.provider,
    poster: movie.backdropUrl,
    storageId: movie.id,
  };
};

export const VideoWatchPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const movieId = typeof params.id === "string" ? params.id : "";
  const [episodeId] = useQueryState("episode", parseAsString);
  const [returnTo] = useQueryState(RETURN_TO_QUERY_KEY, parseAsString);
  const [activeTab, setActiveTab] = useState<VideoWatchTab | null>(null);
  const { data: movie, loading } = useRead(
    (api) => api("movies/:id").GET({ params: { id: movieId } }),
    { enabled: !!movieId },
  );

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

  const toggleActiveTab = (tab: VideoWatchTab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div
      className={classNames(
        "h-dvh w-full overflow-hidden bg-black text-white flex flex-col",
        "selection:bg-accent/40",
      )}
    >
      <main className={classNames("relative min-h-0 flex-1 bg-black")}>
        <VideoWatchPlayer
          key={source.storageId}
          sourceUrl={source.sourceUrl}
          provider={source.provider}
          poster={source.poster}
          storageId={source.storageId}
        />
      </main>

      <VideoWatchPanel activeTab={activeTab} movie={movie} />

      <VideoWatchBottomBar
        title={source.title}
        time={source.time}
        activeTab={activeTab}
        onBack={() =>
          router.push(
            serializeMovieDetailSearchParams(`/movie/${movie.id}`, {
              returnTo,
            }),
          )
        }
        onToggleTab={toggleActiveTab}
      />
    </div>
  );
};
