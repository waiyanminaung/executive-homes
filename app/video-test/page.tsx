import Link from "next/link";
import { ArrowLeft, BadgeCheck, Radio } from "lucide-react";
import { VIDEO_TEST_STREAM } from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";
import { PKVideoPlayer } from "./components/PKVideoPlayer";
import { VideoTestSidebar } from "./components/VideoTestSidebar";

export default function VideoTestPage() {
  return (
    <main className={classNames("min-h-screen bg-[#080808] text-white")}>
      <div
        className={classNames("mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8")}
      >
        <header
          className={classNames(
            "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center",
            "sm:justify-between",
          )}
        >
          <Link
            href="/"
            className={classNames(
              "inline-flex w-fit items-center gap-2 rounded-full",
              "border border-white/10 bg-white/5 px-4 py-2 text-sm",
              "font-bold text-white/75 transition hover:bg-white/10 hover:text-white",
            )}
          >
            <ArrowLeft className={classNames("size-4")} />
            Back
          </Link>

          <div className={classNames("flex flex-wrap items-center gap-2")}>
            <span
              className={classNames(
                "inline-flex items-center gap-2 rounded-full",
                "border border-accent/25 bg-accent/10 px-3 py-1.5",
                "text-xs font-black uppercase tracking-widest text-accent",
              )}
            >
              <Radio className={classNames("size-3.5")} />
              HLS
            </span>
            <span
              className={classNames(
                "inline-flex items-center gap-2 rounded-full",
                "border border-white/10 bg-white/5 px-3 py-1.5",
                "text-xs font-black uppercase tracking-widest text-white/55",
              )}
            >
              <BadgeCheck className={classNames("size-3.5")} />
              Video.js v10
            </span>
          </div>
        </header>

        <div
          className={classNames(
            "grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]",
          )}
        >
          <section className={classNames("min-w-0")}>
            <PKVideoPlayer
              src={VIDEO_TEST_STREAM.src}
              sourceType={VIDEO_TEST_STREAM.sourceType}
              poster={VIDEO_TEST_STREAM.poster}
            />

            <div className={classNames("mt-4 flex flex-wrap gap-2 text-xs")}>
              <span
                className={classNames(
                  "rounded-full bg-white/5 px-3 py-1.5 text-white/55",
                )}
              >
                {VIDEO_TEST_STREAM.subtitle}
              </span>
              <span
                className={classNames(
                  "rounded-full bg-white/5 px-3 py-1.5 text-white/55",
                )}
              >
                {VIDEO_TEST_STREAM.duration}
              </span>
              <span
                className={classNames(
                  "rounded-full bg-white/5 px-3 py-1.5 text-white/55",
                )}
              >
                {VIDEO_TEST_STREAM.rating}
              </span>
            </div>
          </section>

          <VideoTestSidebar />
        </div>
      </div>
    </main>
  );
}
