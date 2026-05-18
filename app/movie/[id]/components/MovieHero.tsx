"use client";

import Image from "next/image";
import Link from "next/link";
import { createSerializer, parseAsString, useQueryState } from "nuqs";
import { ArrowLeft, Play } from "lucide-react";
import { classNames } from "@/utils/classNames";
import {
  getSafeReturnToPath,
  RETURN_TO_QUERY_KEY,
} from "@/utils/navigationReturn";
import type { Content } from "@/types/content";

interface MovieHeroProps {
  movie: Content;
}

const serializeWatchSearchParams = createSerializer({
  [RETURN_TO_QUERY_KEY]: parseAsString,
});

export const MovieHero = ({ movie }: MovieHeroProps) => {
  const [returnTo] = useQueryState(RETURN_TO_QUERY_KEY, parseAsString);
  const safeReturnTo = getSafeReturnToPath(returnTo);

  return (
    <div
      className={classNames(
        "relative h-[50vh] lg:h-[90vh] overflow-hidden bg-black",
      )}
    >
      <Image
        src={movie.backdropUrl}
        alt={movie.title}
        fill
        priority
        sizes="100vw"
        className={classNames("object-cover")}
        referrerPolicy="no-referrer"
      />
      <div
        className={classNames(
          "absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent",
        )}
      />

      <Link
        href={safeReturnTo}
        className={classNames(
          "absolute left-4 top-4 z-20 size-11 rounded-full",
          "border border-white/10 bg-black/45 text-white backdrop-blur-md",
          "flex items-center justify-center",
          "transition-all hover:bg-white/10 active:scale-95",
          "lg:left-8 lg:top-8 lg:size-12",
        )}
        aria-label="Back"
      >
        <ArrowLeft className={classNames("size-5")} />
      </Link>

      <div
        className={classNames(
          "absolute inset-0 flex items-center justify-center p-6",
        )}
      >
        <Link
          href={serializeWatchSearchParams(`/movie/${movie.id}/watch`, {
            returnTo: safeReturnTo,
          })}
          className={classNames(
            "w-20 h-20 lg:w-28 lg:h-28 bg-accent/90 backdrop-blur-sm",
            "rounded-full flex items-center justify-center text-white",
            "shadow-2xl shadow-accent/20 transition-colors border border-white/10",
          )}
          aria-label="Play movie"
        >
          <Play
            className={classNames("w-8 h-8 lg:w-12 lg:h-12 fill-current ml-1")}
          />
        </Link>
      </div>
    </div>
  );
};
