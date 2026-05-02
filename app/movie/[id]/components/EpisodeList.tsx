"use client";

import { Download, Play, Send } from "lucide-react";
import type { Episode, Season } from "@/types/content";
import { classNames } from "@/utils/classNames";

interface EpisodeListProps {
  seasons: Season[];
  selectedSeason: number;
  onSeasonChange: (seasonNumber: number) => void;
  onEpisodePlay: (episode: Episode) => void;
  onEpisodeDownload: (episode: Episode) => void;
}

export const EpisodeList = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  onEpisodePlay,
  onEpisodeDownload,
}: EpisodeListProps) => {
  const currentSeason = seasons.find(
    (season) => season.seasonNumber === selectedSeason,
  );

  if (!currentSeason) return null;

  return (
    <div className={classNames("mt-8 lg:mt-12")}>
      <div
        className={classNames("flex items-center justify-between mb-4 lg:mb-8")}
      >
        <h3
          className={classNames(
            "text-xl font-black uppercase tracking-tighter",
          )}
        >
          Season များ
        </h3>
        <div className={classNames("flex gap-2")}>
          {seasons.map((season) => (
            <button
              key={season.id}
              type="button"
              onClick={() => onSeasonChange(season.seasonNumber)}
              className={classNames(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase",
                "tracking-widest transition-all",
                selectedSeason === season.seasonNumber
                  ? "bg-accent text-white"
                  : "bg-white/5 text-ink-secondary hover:text-white",
              )}
            >
              S{season.seasonNumber}
            </button>
          ))}
        </div>
      </div>

      <div className={classNames("grid gap-2 lg:gap-4")}>
        {currentSeason.episodes.map((episode) => (
          <div
            key={episode.id}
            className={classNames(
              "group flex flex-col sm:flex-row gap-3 lg:gap-4 p-3 lg:p-4",
              "bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5",
              "transition-all cursor-pointer",
            )}
            onClick={() => onEpisodePlay(episode)}
          >
            <div
              className={classNames(
                "relative w-full sm:w-40 lg:w-48 aspect-video rounded-xl",
                "overflow-hidden bg-card shrink-0",
              )}
            >
              <img
                src={episode.posterUrl}
                alt={episode.title}
                className={classNames(
                  "w-full h-full object-cover transition-transform duration-500",
                  "group-hover:scale-110 opacity-60 group-hover:opacity-100",
                )}
                referrerPolicy="no-referrer"
              />
              <div
                className={classNames(
                  "absolute inset-0 flex items-center justify-center",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                )}
              >
                <Play
                  className={classNames("w-8 h-8 text-white fill-current")}
                />
              </div>
            </div>
            <div className={classNames("flex flex-col justify-center flex-1")}>
              <div
                className={classNames("flex items-center justify-between mb-1")}
              >
                <span
                  className={classNames(
                    "text-[10px] font-black text-accent uppercase tracking-widest",
                  )}
                >
                  အပိုင်း {episode.episodeNumber}
                </span>
                <div className={classNames("flex items-center gap-4")}>
                  {episode.embedUrl ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEpisodePlay(episode);
                      }}
                      className={classNames(
                        "text-[10px] font-black text-accent hover:underline",
                        "uppercase flex items-center gap-1",
                      )}
                    >
                      <Play className={classNames("w-3 h-3 fill-current")} />
                      Watch
                    </button>
                  ) : null}
                  {episode.telegramUrl ? (
                    <a
                      href={episode.telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className={classNames(
                        "text-[10px] font-black text-[#24A1DE] hover:underline",
                        "uppercase flex items-center gap-1",
                      )}
                    >
                      <Send className={classNames("w-3 h-3")} />
                      Stream
                    </a>
                  ) : null}
                  {episode.downloadLinks?.length ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEpisodeDownload(episode);
                      }}
                      className={classNames(
                        "text-[10px] font-black text-white/40 hover:text-white",
                        "uppercase flex items-center gap-1",
                      )}
                    >
                      <Download className={classNames("w-3 h-3")} />
                      Download
                    </button>
                  ) : null}
                  <span
                    className={classNames(
                      "text-[10px] font-bold text-ink-secondary",
                      "lowercase tracking-widest",
                    )}
                  >
                    {episode.duration}
                  </span>
                </div>
              </div>
              <h4
                className={classNames(
                  "text-lg font-bold text-white",
                  "group-hover:text-accent transition-colors",
                )}
              >
                {episode.title}
              </h4>
              <p
                className={classNames(
                  "text-sm text-ink-secondary line-clamp-2 mt-1",
                )}
              >
                {episode.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
