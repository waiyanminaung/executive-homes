"use client";

import { Bookmark, Flag, Info } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { VideoWatchTab } from "./VideoWatchPage";

interface VideoWatchBottomBarProps {
  title: string;
  activeTab: VideoWatchTab | null;
  isInWatchlist: boolean;
  onReport: () => void;
  onToggleWatchlist: () => void;
  onToggleTab: (tab: VideoWatchTab) => void;
}

export const VideoWatchBottomBar = ({
  title,
  activeTab,
  isInWatchlist,
  onReport,
  onToggleWatchlist,
  onToggleTab,
}: VideoWatchBottomBarProps) => {
  return (
    <div
      className={classNames(
        "h-16 px-4 lg:px-6 flex items-center justify-between z-50",
        "bg-[#202124] border-t border-white/5",
      )}
    >
      <div className={classNames("flex items-center gap-2 text-white/90")}>
        <span
          className={classNames(
            "text-sm font-bold tracking-tight uppercase line-clamp-1",
            "max-w-[150px] sm:max-w-[220px]",
          )}
        >
          {title}
        </span>
      </div>

      <div className={classNames("flex items-center gap-1")}>
        <button
          type="button"
          onClick={onToggleWatchlist}
          className={classNames(
            "w-9 h-9 rounded-full flex items-center justify-center",
            "transition-all cursor-pointer",
            isInWatchlist
              ? "text-red-500 bg-red-500/10 border border-red-500/20"
              : "text-white/60 hover:bg-white/5 border border-transparent",
          )}
          title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          aria-label={
            isInWatchlist ? "Remove from watchlist" : "Add to watchlist"
          }
        >
          <Bookmark
            className={classNames(
              "w-4 h-4",
              isInWatchlist ? "fill-current" : "",
            )}
          />
        </button>

        <button
          type="button"
          onClick={onReport}
          className={classNames(
            "w-9 h-9 rounded-full flex items-center justify-center",
            "text-white/60 hover:bg-white/5 hover:text-amber-400",
            "border border-transparent transition-all cursor-pointer",
          )}
          title="Report"
          aria-label="Report"
        >
          <Flag className={classNames("w-4 h-4")} />
        </button>

        <button
          type="button"
          onClick={() => onToggleTab("info")}
          className={classNames(
            "w-9 h-9 rounded-full flex items-center justify-center",
            "transition-all cursor-pointer",
            activeTab === "info"
              ? "text-accent bg-accent/10 border border-accent/20"
              : "text-white/60 hover:bg-white/5 border border-transparent",
          )}
          title="Movie Info"
          aria-label="Movie Info"
        >
          <Info className={classNames("w-4 h-4")} />
        </button>
      </div>
    </div>
  );
};
