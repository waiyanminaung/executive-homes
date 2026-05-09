import { CheckCircle2, Circle, Server } from "lucide-react";
import { VIDEO_TEST_EPISODES } from "@/constants/videoPlayer";
import { classNames } from "@/utils/classNames";

export const VideoTestSidebar = () => {
  return (
    <aside
      className={classNames(
        "rounded-2xl border border-white/10 bg-white/[0.03]",
        "p-4 shadow-[0_16px_60px_rgba(0,0,0,0.28)] lg:p-5",
      )}
    >
      <div className={classNames("mb-5 flex items-center gap-3")}>
        <div
          className={classNames(
            "flex size-10 items-center justify-center rounded-full",
            "bg-accent/15 text-accent",
          )}
        >
          <Server className={classNames("size-5")} />
        </div>
        <div className={classNames("min-w-0")}>
          <h2 className={classNames("font-black text-white")}>
            Stream Server
          </h2>
          <p className={classNames("text-xs text-white/45")}>
            Test environment
          </p>
        </div>
      </div>

      <div className={classNames("space-y-2")}>
        {VIDEO_TEST_EPISODES.map((episode) => (
          <div
            key={episode.title}
            className={classNames(
              "flex items-center gap-3 rounded-xl border p-3",
              episode.isActive
                ? "border-accent/40 bg-accent/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/45",
            )}
          >
            {episode.isActive ? (
              <CheckCircle2 className={classNames("size-4 text-accent")} />
            ) : (
              <Circle className={classNames("size-4")} />
            )}
            <div className={classNames("min-w-0")}>
              <p className={classNames("truncate text-sm font-bold")}>
                {episode.title}
              </p>
              <p className={classNames("text-xs opacity-70")}>
                {episode.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
