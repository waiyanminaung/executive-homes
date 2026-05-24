"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import type { Content, Episode } from "@/types/content";
import { classNames } from "@/utils/classNames";
import { MOVIE_PLAY_QUERY_KEY } from "./movieDetailSearchParams";
import { MoviePartyBanner } from "./MoviePartyBanner";
import { MoviePlayer } from "./MoviePlayer";
import { useMoviePartyRoom } from "./useMoviePartyRoom";

interface WatchSource {
  title: string;
  sourceUrl?: string;
  provider?: Episode["provider"];
  poster?: string;
  storageId: string;
}

interface MovieInlinePlayerProps {
  movie: Content;
  source: WatchSource;
}

export const MovieInlinePlayer = ({
  movie,
  source,
}: MovieInlinePlayerProps) => {
  const [playState, setPlayState] = useQueryState(
    MOVIE_PLAY_QUERY_KEY,
    parseAsString,
  );
  const [copiedJoinLink, setCopiedJoinLink] = useState(false);
  const watchParty = useMoviePartyRoom({
    isControllableSource: !!source.sourceUrl && source.provider === "S3",
  });
  const aspectRatio =
    movie.width && movie.height ? `${movie.width} / ${movie.height}` : "16 / 9";
  const isPlayerOpen = watchParty.isEnabled || playState === "1";

  const handleCopyJoinLink = async () => {
    if (!watchParty.room) {
      return;
    }

    await navigator.clipboard.writeText(
      `${window.location.origin}${watchParty.room.joinPath}`,
    );
    setCopiedJoinLink(true);
    window.setTimeout(() => setCopiedJoinLink(false), 1500);
  };

  return (
    <section>
      <div className={classNames("bg-black lg:overflow-hidden lg:rounded-4xl")}>
        <main
          className={classNames(
            "relative overflow-hidden bg-black",
            !isPlayerOpen && "before:absolute before:inset-0 before:z-1",
            !isPlayerOpen &&
              "before:bg-[radial-gradient(circle_at_top,#ffffff12,transparent_45%)]",
          )}
          style={{ aspectRatio }}
        >
          {watchParty.room ? (
            <MoviePartyBanner
              copied={copiedJoinLink}
              onCopyJoinLink={handleCopyJoinLink}
              room={watchParty.room}
              unsupportedMessage={watchParty.unsupportedMessage}
            />
          ) : null}

          {watchParty.isClosed ? (
            <div
              className={classNames(
                "absolute inset-0 flex items-center justify-center px-6 text-center",
              )}
            >
              <p
                className={classNames(
                  "max-w-md text-sm font-semibold leading-7 text-white/65",
                )}
              >
                This room is no longer active. Start a new room to continue
                watching together.
              </p>
            </div>
          ) : !isPlayerOpen ? (
            <button
              type="button"
              onClick={() => void setPlayState("1")}
              className={classNames(
                "group absolute inset-0 block w-full bg-black",
              )}
            >
              <Image
                src={movie.backdropUrl}
                alt={source.title}
                fill
                sizes="(min-width: 1280px) 896px, 100vw"
                className={classNames(
                  "object-cover opacity-75 transition-transform duration-500",
                  "group-hover:scale-105 group-hover:opacity-90",
                )}
                referrerPolicy="no-referrer"
              />
              <div
                className={classNames(
                  "absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent",
                )}
              />
              <div
                className={classNames(
                  "absolute inset-0 z-[2] flex flex-col items-center justify-center gap-5 p-6",
                )}
              >
                <div
                  className={classNames(
                    "flex size-16 items-center justify-center rounded-full",
                    "border border-white/15 bg-accent/90 text-white shadow-2xl",
                    "transition-transform group-hover:scale-105 lg:size-20",
                  )}
                >
                  <Play
                    className={classNames("size-7 fill-current lg:size-8")}
                  />
                </div>
              </div>
            </button>
          ) : (
            <MoviePlayer
              key={`${source.storageId}:${watchParty.room?.roomId ?? "solo"}`}
              sourceUrl={source.sourceUrl}
              provider={source.provider}
              poster={source.poster}
              storageId={source.storageId}
              isInteractionLocked={
                watchParty.isEnabled && !watchParty.canControl
              }
              onPlaybackStateChange={(state) => {
                watchParty.syncPlaybackState(state, true);
              }}
              syncState={watchParty.viewerPlaybackState}
            />
          )}
        </main>
      </div>
    </section>
  );
};
