"use client";

import Link from "next/link";
import { Heart, Trash2, X } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import type { Content } from "@/types/content";
import { classNames } from "@/utils/classNames";

interface WatchlistModalProps {
  isOpen: boolean;
  items: Content[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const WatchlistModal = ({
  isOpen,
  items,
  onClose,
  onRemove,
  onClear,
}: WatchlistModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={classNames(
        "fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl",
        "flex items-center justify-center p-6",
      )}
      onClick={onClose}
    >
      <div
        className={classNames(
          "bg-[#111] w-full max-w-2xl rounded-[2rem] lg:rounded-[3rem]",
          "p-6 lg:p-12 border border-white/5 relative overflow-hidden",
          "mx-4 lg:mx-0 shadow-[0_0_50px_rgba(255,45,85,0.1)]",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="icon"
          onClick={onClose}
          className={classNames(
            "absolute top-4 lg:top-8 right-4 lg:right-8",
            "p-3 text-white/30 hover:text-white transition-colors",
          )}
        >
          <X className={classNames("w-5 h-5 lg:w-6 lg:h-6")} />
        </Button>

        <div className={classNames("mb-6 lg:mb-10")}>
          <div className={classNames("flex items-center gap-2 mb-2")}>
            <Heart className={classNames("w-4 h-4 fill-accent text-accent")} />
            <span
              className={classNames(
                "text-[10px] font-black uppercase tracking-[0.3em] text-white/30",
              )}
            >
              Your Collection
            </span>
          </div>
          <h2
            className={classNames(
              "text-2xl lg:text-4xl font-black uppercase tracking-tighter",
            )}
          >
            My Watchlist
          </h2>
          <p
            className={classNames(
              "text-ink-secondary text-xs lg:text-sm mt-1 lg:mt-2",
            )}
          >
            သိမ်းဆည်းထားသော ရုပ်ရှင်နှင့် ဇာတ်လမ်းတွဲများ
          </p>
        </div>

        <div
          className={classNames(
            "max-h-[60vh] lg:max-h-[50vh] overflow-y-auto",
            "pr-2 lg:pr-4 no-scrollbar",
          )}
        >
          {items.length === 0 ? (
            <div
              className={classNames(
                "py-12 lg:py-20 text-center flex flex-col items-center",
                "gap-4 text-white/10 uppercase font-black tracking-widest",
                "border-2 border-dashed border-white/5 rounded-2xl lg:rounded-3xl",
              )}
            >
              <Heart
                className={classNames("w-10 h-10 lg:w-12 lg:h-12 opacity-50")}
              />
              စာရင်းမရှိသေးပါ
            </div>
          ) : (
            <div className={classNames("grid grid-cols-1 gap-3 lg:gap-4")}>
              {items.map((movie) => (
                <div
                  key={`watchlist-${movie.id}`}
                  className={classNames(
                    "group flex items-center gap-4 lg:gap-6 p-3 lg:p-4",
                    "bg-white/5 rounded-xl lg:rounded-2xl border border-white/5",
                    "hover:bg-white/10 transition-all",
                  )}
                >
                  <Link
                    href={`/movie/${movie.id}`}
                    className={classNames(
                      "w-16 h-24 lg:w-20 lg:h-28 rounded-lg lg:rounded-xl",
                      "overflow-hidden shrink-0 border border-white/5",
                    )}
                    onClick={onClose}
                  >
                    <img
                      src={movie.posterUrl}
                      className={classNames("w-full h-full object-cover")}
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className={classNames("flex-1 min-w-0")}>
                    <Link
                      href={`/movie/${movie.id}`}
                      className={classNames(
                        "text-base lg:text-xl font-bold text-white",
                        "hover:text-accent transition-colors truncate block",
                      )}
                      onClick={onClose}
                    >
                      {movie.title}
                    </Link>
                    <p
                      className={classNames(
                        "text-white/30 text-[9px] lg:text-[10px] font-bold",
                        "uppercase tracking-widest mt-1",
                      )}
                    >
                      {movie.year} • {movie.type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => onRemove(movie.id)}
                    className={classNames(
                      "p-3 lg:p-4 text-red-500/30 hover:text-red-500",
                      "hover:bg-red-500/10 rounded-xl transition-all",
                    )}
                  >
                    <Trash2 className={classNames("w-4 h-4 lg:w-5 lg:h-5")} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div
            className={classNames(
              "mt-8 pt-8 border-t border-white/5 flex justify-between items-center",
            )}
          >
            <p
              className={classNames(
                "text-[10px] font-bold uppercase tracking-[0.2em] text-white/20",
              )}
            >
              {items.length} items saved
            </p>
            <button
              type="button"
              onClick={onClear}
              className={classNames(
                "text-[10px] font-black uppercase tracking-[0.2em]",
                "text-red-500 hover:underline",
              )}
            >
              Clear All
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
