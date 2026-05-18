"use client";

import { Suspense } from "react";
import { classNames } from "@/utils/classNames";
import { VideoWatchPage } from "./components/VideoWatchPage";

const WatchPageFallback = () => {
  return (
    <div
      className={classNames(
        "h-dvh bg-black flex items-center justify-center text-white",
      )}
    >
      <div
        className={classNames(
          "w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin",
        )}
      />
    </div>
  );
};

export default function MovieWatchRoute() {
  return (
    <Suspense fallback={<WatchPageFallback />}>
      <VideoWatchPage />
    </Suspense>
  );
}
