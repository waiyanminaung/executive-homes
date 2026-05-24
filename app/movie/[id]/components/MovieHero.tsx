"use client";

import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { ArrowLeft } from "lucide-react";
import { classNames } from "@/utils/classNames";
import {
  getSafeReturnToPath,
  RETURN_TO_QUERY_KEY,
} from "@/utils/navigationReturn";
import type { Content } from "@/types/content";

interface MovieHeroProps {
  movie: Content;
}

export const MovieHero = ({ movie }: MovieHeroProps) => {
  const [returnTo] = useQueryState(RETURN_TO_QUERY_KEY, parseAsString);
  const safeReturnTo = getSafeReturnToPath(returnTo);

  return (
    <div
      className={classNames(
        "relative overflow-hidden border-b border-white/5 bg-[#0A0A0A]",
      )}
    >
      <div className={classNames("mx-auto max-w-4xl px-6 py-5 lg:py-7")}>
        <div className={classNames("flex items-center justify-between gap-4")}>
          <Link
            href={safeReturnTo}
            className={classNames(
              "size-11 rounded-full border border-white/10 bg-white/5 text-white",
              "flex items-center justify-center transition-all hover:bg-white/10",
              "active:scale-95 lg:size-12",
            )}
            aria-label="Back"
          >
            <ArrowLeft className={classNames("size-5")} />
          </Link>

          <div className={classNames("min-w-0 text-right")}>
            <div
              className={classNames(
                "text-[10px] font-black uppercase tracking-[0.3em] text-white/30",
              )}
            >
              {movie.type === "movie" ? "Movie Detail" : "Series Detail"}
            </div>
            <div
              className={classNames(
                "mt-1 line-clamp-1 text-sm font-bold uppercase tracking-[0.12em] text-white/70",
              )}
            >
              {movie.title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
