"use client";

import { useParams } from "next/navigation";
import { classNames } from "@/utils/classNames";
import { useRead } from "@/lib/spoosh";
import { VideoPlayerModal } from "../../components";

export default function PlayModalPage() {
  const params = useParams<{ id: string }>();
  const movieId = typeof params.id === "string" ? params.id : "";
  const { data: movie, loading } = useRead(
    (api) => api("movies/:id").GET({ params: { id: movieId } }),
    { enabled: !!movieId },
  );

  if (loading) {
    return (
      <div
        className={classNames(
          "fixed inset-0 z-[300] bg-black flex items-center justify-center",
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
    return null;
  }

  const firstEpisode = movie.seasons?.[0]?.episodes[0];
  const sourceUrl =
    movie.type === "series" ? firstEpisode?.sourceUrl : movie.sourceUrl;
  const provider =
    movie.type === "series" ? firstEpisode?.provider : movie.provider;

  return (
    <VideoPlayerModal
      movie={movie}
      provider={provider}
      sourceUrl={sourceUrl}
    />
  );
}
