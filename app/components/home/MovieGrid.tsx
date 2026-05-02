"use client";

import Link from "next/link";
import { Flame, Film, Star, Zap } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { Content } from "@/types/content";

interface MovieGridProps {
  items: Content[];
  isLoading: boolean;
  isSearchActive: boolean;
}

export const MovieGrid = ({
  items,
  isLoading,
  isSearchActive,
}: MovieGridProps) => {
  if (isLoading) {
    return (
      <div
        className={classNames(
          "grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-6 opacity-50",
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className={classNames(
              "aspect-[2/3] bg-white/5 rounded-2xl animate-pulse",
            )}
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={classNames("py-24 text-center")}>
        <Film className={classNames("w-12 h-12 text-white/10 mx-auto mb-4")} />
        <h3
          className={classNames(
            "text-white/30 font-black uppercase tracking-widest text-xs",
          )}
        >
          ရုပ်ရှင်များ မရှိသေးပါ
        </h3>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-6",
        isSearchActive ? "max-w-4xl mx-auto" : "",
      )}
    >
      {items.map((movie) => (
        <Link
          href={`/movie/${movie.id}`}
          key={movie.id}
          className={classNames("group cursor-pointer relative")}
        >
          <div
            className={classNames(
              "relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-[#2A2A2A]",
              "shadow-lg border border-white/5 group-hover:border-accent/30 transition-colors",
            )}
          >
            <div
              className={classNames(
                "absolute top-3 left-3 flex flex-col gap-2 z-20",
              )}
            >
              {movie.isTrending ? (
                <div
                  className={classNames(
                    "flex items-center gap-1.5 px-2 py-1 bg-accent text-white",
                    "rounded-md shadow-lg border border-white/10",
                  )}
                >
                  <Zap className={classNames("w-2.5 h-2.5 fill-current")} />
                  <span
                    className={classNames(
                      "text-[8px] font-black uppercase tracking-widest",
                    )}
                  >
                    Trending
                  </span>
                </div>
              ) : null}
              {movie.isPopular ? (
                <div
                  className={classNames(
                    "flex items-center gap-1.5 px-2 py-1 bg-[#FBC02D] text-black",
                    "rounded-md shadow-lg border border-black/10",
                  )}
                >
                  <Flame className={classNames("w-2.5 h-2.5 fill-current")} />
                  <span
                    className={classNames(
                      "text-[8px] font-black uppercase tracking-widest",
                    )}
                  >
                    Popular
                  </span>
                </div>
              ) : null}
              {movie.type === "series" &&
              !movie.isTrending &&
              !movie.isPopular ? (
                <div
                  className={classNames(
                    "px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md",
                    "border border-white/20 shadow-lg",
                  )}
                >
                  <span
                    className={classNames(
                      "text-[9px] font-black uppercase tracking-widest text-white",
                    )}
                  >
                    {movie.seasons?.length ?? 0} SEASONS
                  </span>
                </div>
              ) : null}
            </div>

            <img
              src={movie.posterUrl}
              alt={movie.title}
              className={classNames(
                "w-full h-full object-cover transition-transform duration-500",
                "group-hover:scale-110",
              )}
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80";
              }}
            />

            <div
              className={classNames(
                "absolute top-3 right-3 flex items-center gap-1.5 bg-[#FBC02D]",
                "px-2.5 py-1 rounded-md z-20 shadow-xl border border-black/10",
              )}
            >
              <span
                className={classNames(
                  "text-[10px] font-black text-black tracking-tighter",
                )}
              >
                IMDb
              </span>
              <div className={classNames("flex items-center gap-1")}>
                <Star className={classNames("w-3 h-3 fill-black text-black")} />
                <span
                  className={classNames(
                    "text-[12px] font-black text-black leading-none",
                  )}
                >
                  {movie.rating}
                </span>
              </div>
            </div>

            <div
              className={classNames(
                "absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent",
                "flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity",
              )}
            >
              <p
                className={classNames(
                  "text-[14px] font-bold text-white leading-snug line-clamp-2 drop-shadow-md",
                )}
              >
                {movie.title}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
