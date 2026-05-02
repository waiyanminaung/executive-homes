"use client";

import { Play } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { Content } from "@/types/content";

interface MovieHeroProps {
  movie: Content;
  onPlay: () => void;
}

export const MovieHero = ({ movie, onPlay }: MovieHeroProps) => {
  return (
    <div
      className={classNames(
        "relative h-[50vh] lg:h-[90vh] overflow-hidden bg-black",
      )}
    >
      <img
        src={movie.backdropUrl}
        alt={movie.title}
        className={classNames("w-full h-full object-cover")}
        referrerPolicy="no-referrer"
      />
      <div
        className={classNames(
          "absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent",
        )}
      />

      <div
        className={classNames(
          "absolute inset-0 flex items-center justify-center p-6",
        )}
      >
        <Button
          type="button"
          onClick={onPlay}
          className={classNames(
            "w-20 h-20 lg:w-28 lg:h-28 bg-accent/90 backdrop-blur-sm",
            "rounded-full flex items-center justify-center text-white",
            "shadow-2xl shadow-accent/20 transition-colors border border-white/10",
          )}
        >
          <Play
            className={classNames("w-8 h-8 lg:w-12 lg:h-12 fill-current ml-1")}
          />
        </Button>
      </div>
    </div>
  );
};
