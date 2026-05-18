"use client";

import { ArrowLeft, Info } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { VideoWatchTab } from "./VideoWatchPage";

interface VideoWatchBottomBarProps {
  title: string;
  time: string;
  activeTab: VideoWatchTab | null;
  onBack: () => void;
  onToggleTab: (tab: VideoWatchTab) => void;
}

export const VideoWatchBottomBar = ({
  title,
  time,
  activeTab,
  onBack,
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
        <button
          type="button"
          onClick={onBack}
          className={classNames(
            "w-9 h-9 rounded-full hover:bg-white/5 flex items-center",
            "justify-center transition-all cursor-pointer",
          )}
          title="Back to movie detail"
        >
          <ArrowLeft className={classNames("w-4 h-4")} />
        </button>
        <div className={classNames("w-px h-3 bg-white/10 mx-1")} />
        <div className={classNames("flex flex-col")}>
          <span
            className={classNames(
              "text-xs font-bold tracking-tight uppercase line-clamp-1",
              "max-w-[150px] sm:max-w-[220px]",
            )}
          >
            {title}
          </span>
          <span className={classNames("text-[10px] text-white/40 font-medium")}>
            {time}
          </span>
        </div>
      </div>

      <div className={classNames("flex items-center gap-1")}>
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
        >
          <Info className={classNames("w-4 h-4")} />
        </button>
      </div>
    </div>
  );
};
