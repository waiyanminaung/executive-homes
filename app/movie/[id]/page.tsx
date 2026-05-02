"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Download, Heart, Send } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useRead } from "@/lib/spoosh";
import { useWatchlist } from "@/components/@shared/useWatchlist";
import type { Content, Episode } from "@/types/content";
import {
  DownloadModal,
  EpisodeList,
  MovieHero,
  ReportModal,
  VideoPlayerModal,
} from "./components";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const movieId = typeof params.id === "string" ? params.id : "";
  const { data: movie, loading } = useRead(
    (api) => api("movies/:id").GET({ params: { id: movieId } }),
    { enabled: !!movieId },
  );
  const { toggle, isSaved } = useWatchlist();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if (movie?.seasons?.length) {
      setSelectedSeason(movie.seasons[0].seasonNumber);
      setSelectedEpisode(null);
    }
  }, [movie?.id]);

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
  const currentSeason = movie.seasons?.find(
    (season) => season.seasonNumber === selectedSeason,
  );
  const activeEpisode = selectedEpisode ?? currentSeason?.episodes[0];
  const activeEmbedUrl =
    movie.type === "series" ? activeEpisode?.embedUrl : movie.embedUrl;
  const activeDownloads =
    movie.type === "series"
      ? activeEpisode?.downloadLinks
      : movie.downloadLinks;

  return (
    <div className={classNames("min-h-screen bg-[#0A0A0A] pb-24")}>
      {isPlaying ? (
        <VideoPlayerModal
          movie={movie}
          embedUrl={activeEmbedUrl}
          onClose={() => setIsPlaying(false)}
        />
      ) : null}

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

      <MovieHero movie={movie} onPlay={() => setIsPlaying(true)} />

      <div
        className={classNames(
          "px-6 -mt-20 lg:-mt-32 relative z-10 max-w-4xl mx-auto",
        )}
      >
        <div className={classNames("flex flex-col gap-4 lg:gap-6")}>
          <div>
            <div className={classNames("flex items-center gap-3 mb-2")}>
              <span
                className={classNames(
                  "text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]",
                  "text-accent",
                )}
              >
                {movie.type === "movie" ? "ရုပ်ရှင်ကားကြီး" : "ဇာတ်လမ်းတွဲ"}
              </span>
              <span
                className={classNames(
                  "text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]",
                  "text-ink-secondary",
                )}
              >
                IMDb {movie.rating}
              </span>
            </div>
            <h1
              className={classNames(
                "text-3xl lg:text-7xl font-black uppercase tracking-tighter",
                "leading-tight lg:leading-none mb-2 lg:mb-4",
              )}
            >
              {movie.title}
            </h1>

            <div
              className={classNames(
                "flex flex-wrap gap-2 text-[9px] lg:text-[10px]",
                "font-bold uppercase tracking-widest text-ink-secondary",
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
              <span className={classNames("text-white/80")}>
                {movie.genre.join(", ")}
              </span>
            </div>
          </div>

          <div
            className={classNames("flex flex-wrap gap-3 lg:gap-4 mt-4 lg:mt-6")}
          >
            <Button
              type="button"
              onClick={() => toggle(movie)}
              className={classNames(
                "flex items-center gap-2 lg:gap-3 w-fit px-6 lg:px-8",
                "py-3.5 lg:py-4 border border-white/5 rounded-2xl",
                "text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]",
                "transition-all active:scale-95 group",
                isInWatchlist
                  ? "bg-red-500/20 text-red-500 shadow-lg shadow-red-500/10"
                  : "bg-white/5 hover:bg-white/10 text-white/40",
              )}
            >
              <Heart
                className={classNames(
                  "w-3.5 h-3.5 lg:w-4 h-4",
                  isInWatchlist ? "fill-current" : "",
                )}
              />
              {isInWatchlist ? "သိမ်းဆည်းပြီး" : "နောက်မှ ကြည့်ရန်"}
            </Button>

            {movie.type === "movie" ? (
              <Button
                type="button"
                onClick={() => {
                  setSelectedEpisode(null);
                  setIsDownloadOpen(true);
                }}
                className={classNames(
                  "flex items-center gap-2 lg:gap-3 w-fit px-6 lg:px-8",
                  "py-3.5 lg:py-4 bg-white/5 hover:bg-white/10",
                  "border border-white/5 rounded-2xl",
                  "text-[9px] lg:text-[10px] font-black uppercase",
                  "tracking-[0.2em] transition-all active:scale-95 group",
                )}
              >
                <Download
                  className={classNames("w-3.5 h-3.5 lg:w-4 h-4 text-accent")}
                />
                ဒေါင်းလုဒ်ဆွဲမည်
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
                  "border border-[#24A1DE]/20 rounded-2xl",
                  "text-[9px] lg:text-[10px] font-black uppercase",
                  "tracking-[0.2em] transition-all active:scale-95 group text-[#24A1DE]",
                )}
              >
                <Send className={classNames("w-3.5 h-3.5 lg:w-4 h-4")} />
                Telegram တွင်ကြည့်မည်
              </a>
            ) : null}

            <Button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className={classNames(
                "flex items-center gap-2 lg:gap-3 w-fit px-6 lg:px-8",
                "py-3.5 lg:py-4 bg-white/5 hover:bg-white/10",
                "border border-white/5 rounded-2xl",
                "text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]",
                "transition-all active:scale-95 group text-white/40 hover:text-white",
              )}
            >
              <AlertCircle
                className={classNames("w-3.5 h-3.5 lg:w-4 h-4 text-white/20")}
              />
              တိုင်ကြားရန်
            </Button>
          </div>

          {movie.type === "series" && movie.seasons?.length ? (
            <EpisodeList
              seasons={movie.seasons}
              selectedSeason={selectedSeason}
              onSeasonChange={(season) => {
                setSelectedSeason(season);
                setSelectedEpisode(null);
              }}
              onEpisodePlay={(episode) => {
                setSelectedEpisode(episode);
                setIsPlaying(true);
              }}
              onEpisodeDownload={(episode) => {
                setSelectedEpisode(episode);
                setIsDownloadOpen(true);
              }}
            />
          ) : null}

          <div
            className={classNames(
              "pt-6 lg:pt-8 border-t border-white/5 mt-4 lg:mt-12",
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
                "text-white/70 text-sm leading-relaxed max-w-2xl",
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
