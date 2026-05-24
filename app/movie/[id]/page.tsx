"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { Bookmark, Download, Flag, Send } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useRead } from "@/lib/spoosh";
import { useWatchlist } from "@/components/@shared/useWatchlist";
import type { Episode } from "@/types/content";
import {
  getSafeReturnToPath,
  RETURN_TO_QUERY_KEY,
} from "@/utils/navigationReturn";
import {
  DownloadModal,
  EpisodeList,
  MovieInlinePlayer,
  ReportModal,
  WatchPartyActions,
} from "./components";
import { MOVIE_EPISODE_QUERY_KEY } from "./components/movieDetailSearchParams";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = typeof params.id === "string" ? params.id : "";
  const { data: movie, loading } = useRead(
    (api) => api("movies/:id").GET({ params: { id: movieId } }),
    { enabled: !!movieId },
  );
  const { toggle, isSaved } = useWatchlist();
  const [episodeId, setEpisodeId] = useQueryState(
    MOVIE_EPISODE_QUERY_KEY,
    parseAsString,
  );
  const [returnTo] = useQueryState(RETURN_TO_QUERY_KEY, parseAsString);

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  if (loading) {
    return (
      <div
        className={classNames(
          "min-h-screen bg-[#0A0A0A] flex items-center justify-center",
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
          "min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/20 uppercase font-black tracking-widest px-6",
        )}
      >
        ဇာတ်ကား ရှာမတွေ့ပါ
      </div>
    );
  }

  const isInWatchlist = isSaved(movie.id);
  const episodeSeasonNumber = movie.seasons?.find((season) =>
    season.episodes.some((episode) => episode.id === episodeId),
  )?.seasonNumber;
  const effectiveSelectedSeason = movie.seasons?.some(
    (season) => season.seasonNumber === (episodeSeasonNumber ?? selectedSeason),
  )
    ? (episodeSeasonNumber ?? selectedSeason)
    : (movie.seasons?.[0]?.seasonNumber ?? 1);
  const currentSeason = movie.seasons?.find(
    (season) => season.seasonNumber === effectiveSelectedSeason,
  );
  const activeEpisode =
    currentSeason?.episodes.find((episode) => episode.id === episodeId) ??
    currentSeason?.episodes.find(
      (episode) => episode.id === selectedEpisode?.id,
    ) ??
    currentSeason?.episodes[0];
  const activeDownloads =
    movie.type === "series"
      ? activeEpisode?.downloadLinks
      : movie.downloadLinks;
  const activeProvider =
    movie.type === "series" ? activeEpisode?.provider : movie.provider;
  const activeSourceUrl =
    movie.type === "series" ? activeEpisode?.sourceUrl : movie.sourceUrl;
  const activeEpisodeId =
    movie.type === "series" ? activeEpisode?.id : undefined;
  const isWatchPartySupported = !!activeSourceUrl && activeProvider === "S3";
  const safeReturnTo = getSafeReturnToPath(returnTo);

  return (
    <div
      className={classNames(
        "relative min-h-screen overflow-hidden bg-[#050505] pb-24",
      )}
    >
      <DownloadModal
        isOpen={isDownloadOpen}
        title={movie.title}
        links={activeDownloads}
        onClose={() => setIsDownloadOpen(false)}
      />

      <ReportModal
        isOpen={isReportOpen}
        title={movie.title}
        onClose={() => setIsReportOpen(false)}
      />

      <div
        className={classNames(
          "relative z-10 mx-auto max-w-4xl px-6 pt-6 lg:pt-8",
        )}
      >
        <section
          className={classNames("relative overflow-visible lg:rounded-4xl")}
        >
          <div
            aria-hidden="true"
            className={classNames(
              "absolute inset-x-0 bottom-0 h-64 pointer-events-none",
              "bg-linear-to-t from-[#050505] via-[#050505]/90 to-transparent",
            )}
          />

          <div className={classNames("relative z-10 mb-6")}>
            <div
              className={classNames(
                "flex w-full items-center justify-between gap-2",
              )}
            >
              <Link
                href={safeReturnTo}
                className={classNames(
                  "flex size-10 items-center justify-center rounded-2xl",
                  "border border-white/10 bg-black/45 text-white backdrop-blur-md",
                  "transition-all hover:bg-white/10 active:scale-95 lg:size-12",
                )}
                aria-label="Back"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={classNames("size-5")}
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Link>

              <div className={classNames("flex items-center gap-2")}>
                <button
                  type="button"
                  onClick={() => toggle(movie)}
                  className={classNames(
                    "flex size-10 items-center justify-center rounded-2xl",
                    "border border-white/10 bg-black/45 text-white/70 backdrop-blur-md",
                    "transition-all hover:bg-white/10 hover:text-white active:scale-95 lg:size-11",
                    isInWatchlist && "text-red-500",
                  )}
                  title={
                    isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
                  }
                  aria-label={
                    isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
                  }
                >
                  <Bookmark
                    className={classNames(
                      "size-4",
                      isInWatchlist ? "fill-current" : "",
                    )}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className={classNames(
                    "flex size-10 items-center justify-center rounded-2xl",
                    "border border-white/10 bg-black/45 text-white/70 backdrop-blur-md",
                    "transition-all hover:bg-white/10 hover:text-amber-400 active:scale-95 lg:size-11",
                  )}
                  title="Report"
                  aria-label="Report"
                >
                  <Flag className={classNames("size-4")} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <MovieInlinePlayer
              movie={movie}
              source={{
                title:
                  movie.type === "series" && activeEpisode
                    ? `${movie.title} ${activeEpisode.title}`
                    : movie.title,
                sourceUrl:
                  movie.type === "series"
                    ? activeEpisode?.sourceUrl
                    : movie.sourceUrl,
                provider:
                  movie.type === "series"
                    ? activeEpisode?.provider
                    : movie.provider,
                poster:
                  movie.type === "series"
                    ? (activeEpisode?.posterUrl ?? movie.backdropUrl)
                    : movie.backdropUrl,
                storageId:
                  movie.type === "series"
                    ? (activeEpisode?.id ?? movie.id)
                    : movie.id,
              }}
            />
          </div>
        </section>

        <div className={classNames("mt-5 lg:mt-6")}>
          <h1
            className={classNames(
              "text-[1.65rem] font-black tracking-tight",
              "leading-tight lg:text-[3rem] lg:leading-[0.95]",
            )}
          >
            {movie.title}
          </h1>

          <div
            className={classNames(
              "mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase",
              "tracking-[0.22em] text-white/45",
            )}
          >
            <span>{movie.year}</span>
            <span>•</span>
            {movie.type === "movie" ? (
              <span>{movie.duration}</span>
            ) : (
              <span>Season {movie.seasons?.length} ခု</span>
            )}
            <span>•</span>
            <span>IMDb {movie.rating}</span>
            <span>•</span>
            <span
              className={classNames(
                "text-white/70 whitespace-nowrap overflow-hidden w-full text-ellipsis",
              )}
            >
              {movie.genre.join(" • ")}
            </span>
          </div>
        </div>

        <div
          className={classNames("mt-6 flex flex-col gap-6 lg:mt-8 lg:gap-8")}
        >
          <section
            className={classNames(
              "grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]",
            )}
          >
            <div
              className={classNames(
                "rounded-xl border border-white/8 bg-white/[0.03] p-5 lg:p-6",
              )}
            >
              <div
                className={classNames(
                  "text-[10px] font-black uppercase tracking-[0.28em] text-white/30",
                )}
              >
                Watch Together
              </div>
              <div className={classNames("mt-4")}>
                <WatchPartyActions
                  movieId={movie.id}
                  episodeId={activeEpisodeId}
                  isSupported={isWatchPartySupported}
                />
              </div>
            </div>

            <div
              className={classNames(
                "rounded-xl border border-white/8 bg-white/[0.03] p-5 lg:p-6",
              )}
            >
              <div
                className={classNames(
                  "text-[10px] font-black uppercase tracking-[0.28em] text-white/30",
                )}
              >
                More Ways To Watch
              </div>
              <div className={classNames("mt-4 flex flex-wrap gap-3")}>
                {movie.type === "movie" ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedEpisode(null);
                      setIsDownloadOpen(true);
                    }}
                    title="Download"
                    aria-label="Download"
                    className={classNames(
                      "flex size-11 items-center justify-center rounded-xl",
                      "border border-white/5 bg-white/5 hover:bg-white/10 lg:size-12",
                      "transition-all active:scale-95 group",
                    )}
                  >
                    <Download className={classNames("w-4 h-4 text-accent")} />
                  </Button>
                ) : null}

                {movie.type === "movie" && movie.telegramUrl ? (
                  <a
                    href={movie.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={classNames(
                      "flex items-center gap-2 lg:gap-3 w-fit px-6 lg:px-8",
                      "py-3.5 lg:py-4 bg-[#24A1DE]/10 hover:bg-[#24A1DE]/20",
                      "border border-[#24A1DE]/20 rounded-xl",
                      "text-[9px] lg:text-[10px] font-black uppercase",
                      "tracking-[0.2em] transition-all active:scale-95 group text-[#24A1DE]",
                    )}
                  >
                    <Send className={classNames("w-3.5 h-3.5 lg:w-4 h-4")} />
                    Telegram တွင်ကြည့်မည်
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          {movie.type === "series" && movie.seasons?.length ? (
            <EpisodeList
              movieId={movie.id}
              seasons={movie.seasons}
              selectedSeason={effectiveSelectedSeason}
              onSeasonChange={(season) => {
                setSelectedSeason(season);
                setSelectedEpisode(null);
                void setEpisodeId(null);
              }}
              onEpisodeDownload={(episode) => {
                setSelectedEpisode(episode);
                setIsDownloadOpen(true);
              }}
            />
          ) : null}

          <div
            className={classNames(
              "pt-5 lg:pt-6 border-t border-white/5 mt-2 lg:mt-6",
            )}
          >
            <div
              className={classNames(
                "text-[10px] font-black uppercase tracking-[0.3em]",
                "text-white/20 mb-4",
              )}
            >
              ဇာတ်လမ်းအကျဉ်း
            </div>
            <p
              className={classNames(
                "text-white/70 text-sm leading-relaxed w-full",
                "italic font-light",
              )}
            >
              {movie.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
