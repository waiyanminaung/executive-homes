"use client";

import { Heart } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface WatchlistButtonProps {
  count: number;
  onClick: () => void;
}

export const WatchlistButton = ({ count, onClick }: WatchlistButtonProps) => {
  if (count <= 0) return null;

  return (
    <div
      className={classNames(
        "fixed bottom-8 right-8 z-[150] flex items-center gap-4",
      )}
    >
      <Button
        type="button"
        variant="icon"
        onClick={onClick}
        className={classNames(
          "w-12 h-12 bg-gradient-to-br from-white/20 to-white/5",
          "backdrop-blur-2xl text-white rounded-full shadow-2xl",
          "flex items-center justify-center relative hover:scale-110",
          "active:scale-95 transition-all group border border-white/10",
        )}
      >
        <Heart className={classNames("w-5 h-5 fill-accent text-accent")} />
        <div
          className={classNames(
            "absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1",
            "bg-accent rounded-full flex items-center justify-center",
            "text-[8px] font-black text-white border-2 border-[#0A0A0A]",
          )}
        >
          {count}
        </div>
      </Button>
    </div>
  );
};
