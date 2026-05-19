"use client";

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
        "overflow-y-auto rounded-3xl bg-[#202124] p-5 text-white",
        "border border-white/10 shadow-2xl",
      )}
    >
      {activeTab === "info" ? (
        <div className={classNames("space-y-4")}>
          <div
            className={classNames(
              "text-xs font-black uppercase tracking-[0.08em]",
              "text-white/45",
            )}
          >
            About Movie
          </div>

          <div className={classNames("space-y-1.5")}>
            <h2
              className={classNames(
                "line-clamp-2 text-base font-black tracking-tight text-white",
              )}
            >
              {movie.title}
            </h2>

            <div className={classNames("text-xs font-medium text-white/45")}>
              {movie.year} • {movie.rating} IMDb
            </div>
          </div>

          <p
            className={classNames(
              "text-sm font-medium leading-6 text-white/70",
            )}
          >
            {movie.description}
          </p>
        </div>
      ) : null}
    </aside>
  );
};
