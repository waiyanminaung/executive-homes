"use client";

import { Copy, Radio, Users } from "lucide-react";
import type { WatchPartyRoom } from "@/types/watchParty";
import { classNames } from "@/utils/classNames";

interface MoviePartyBannerProps {
  copied: boolean;
  onCopyJoinLink: () => void;
  room: WatchPartyRoom;
  unsupportedMessage?: string;
}

export const MoviePartyBanner = ({
  copied,
  onCopyJoinLink,
  room,
  unsupportedMessage,
}: MoviePartyBannerProps) => {
  return (
    <div
      className={classNames(
        "absolute right-4 top-20 z-20 max-w-[min(360px,calc(100vw-2rem))]",
        "rounded-3xl border border-white/10 bg-black/55 p-4 text-white",
        "backdrop-blur-md lg:right-6 lg:top-24",
      )}
    >
      <div className={classNames("flex items-start justify-between gap-4")}>
        <div>
          <div
            className={classNames(
              "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/45",
            )}
          >
            <Radio className={classNames("size-3 text-accent")} />
            Watch Party
          </div>
          <div className={classNames("mt-2 flex items-center gap-2")}>
            <span
              className={classNames(
                "rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                room.canControl
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-white/10 bg-white/5 text-white/70",
              )}
            >
              {room.canControl ? "Host" : "Viewer"}
            </span>
            <span
              className={classNames(
                "text-sm font-black tracking-[0.2em] text-white/85",
              )}
            >
              {room.roomId}
            </span>
          </div>
        </div>

        {room.canControl ? (
          <button
            type="button"
            onClick={onCopyJoinLink}
            className={classNames(
              "inline-flex items-center gap-2 rounded-full border border-white/10",
              "bg-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em]",
              "text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            )}
          >
            <Copy className={classNames("size-3.5")} />
            {copied ? "Copied" : "Copy Link"}
          </button>
        ) : null}
      </div>

      <div
        className={classNames(
          "mt-4 flex items-center gap-2 text-xs font-semibold text-white/60",
        )}
      >
        <Users className={classNames("size-3.5")} />
        <span>
          {room.viewerCount} viewer{room.viewerCount === 1 ? "" : "s"} connected
        </span>
      </div>

      <p className={classNames("mt-3 text-xs leading-5 text-white/70")}>
        {room.canControl
          ? "Only you can control playback. Share the join link with friends."
          : "The host controls playback. Your screen follows the live room state."}
      </p>

      {unsupportedMessage ? (
        <p className={classNames("mt-3 text-xs leading-5 text-amber-300/90")}>
          {unsupportedMessage}
        </p>
      ) : null}
    </div>
  );
};
