"use client";

import Image from "next/image";
import type { Content } from "@/types/content";
import { classNames } from "@/utils/classNames";
import type { VideoWatchTab } from "./VideoWatchPage";

interface VideoWatchPanelProps {
  activeTab: VideoWatchTab | null;
  movie: Content;
}

export const VideoWatchPanel = ({
  activeTab,
  movie,
}: VideoWatchPanelProps) => {
  if (!activeTab) {
    return null;
  }

  return (
    <aside
      className={classNames(
        "fixed right-3 bottom-[4.5rem] z-[60]",
        "w-[min(420px,calc(100vw-24px))] max-h-[calc(100dvh-5.5rem)]",
        "overflow-y-auto rounded-3xl bg-white p-5 text-[#202124]",
        "shadow-2xl",
      )}
    >
      {activeTab === "info" ? (
        <div className={classNames("space-y-4")}>
          <div
            className={classNames(
              "text-xs font-black uppercase tracking-[0.08em]",
              "text-[#5f6368]",
            )}
          >
            About Movie
          </div>

          <div className={classNames("flex gap-4")}>
            <div
              className={classNames(
                "relative h-32 w-22 shrink-0 overflow-hidden rounded-xl",
                "bg-[#f1f3f4] shadow-lg",
              )}
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                sizes="88px"
                className={classNames("object-cover")}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className={classNames("min-w-0 flex-1 pt-1")}>
              <h2
                className={classNames(
                  "mb-1.5 line-clamp-2 text-xl font-black tracking-tight",
                  "text-[#202124]",
                )}
              >
                {movie.title}
              </h2>

              <div
                className={classNames(
                  "mb-3 text-sm font-medium text-[#5f6368]",
                )}
              >
                {movie.year} • {movie.rating} IMDb
              </div>

              <div className={classNames("flex flex-wrap gap-1.5")}>
                {movie.genre.map((genre) => (
                  <span
                    key={genre}
                    className={classNames(
                      "rounded-md bg-[#f1f3f4] px-2.5 py-1 text-xs",
                      "font-bold text-[#202124]",
                    )}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p
            className={classNames(
              "line-clamp-5 text-sm font-medium leading-6 text-[#4f5358]",
            )}
          >
            {movie.description}
          </p>
        </div>
      ) : null}
    </aside>
  );
};
