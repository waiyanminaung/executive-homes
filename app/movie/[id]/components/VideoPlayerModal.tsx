"use client";

import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { Content } from "@/types/content";

interface VideoPlayerModalProps {
  movie: Content;
  embedUrl?: string;
  onClose: () => void;
}

export const VideoPlayerModal = ({
  movie,
  embedUrl,
  onClose,
}: VideoPlayerModalProps) => {
  return (
    <div
      className={classNames(
        "fixed inset-0 z-[300] bg-black flex flex-col",
        "items-center justify-center p-4 lg:p-10",
      )}
    >
      <div
        className={classNames(
          "absolute top-6 lg:top-8 left-6 lg:left-8 z-[310]",
          "flex items-center gap-3 lg:gap-4",
        )}
      >
        <Button
          type="button"
          variant="icon"
          onClick={onClose}
          className={classNames(
            "p-2.5 lg:p-3 bg-white/10 hover:bg-white/20",
            "backdrop-blur-md rounded-full text-white transition-all",
            "border border-white/5",
          )}
        >
          <ArrowLeft className={classNames("w-5 h-5 lg:w-6 lg:h-6")} />
        </Button>
        <div className={classNames("min-w-0")}>
          <h2
            className={classNames(
              "text-xs lg:text-sm font-black uppercase tracking-widest text-white",
              "truncate max-w-[200px] lg:max-w-md",
            )}
          >
            {movie.title}
          </h2>
          <p
            className={classNames(
              "text-[9px] lg:text-[10px] text-white/50 uppercase tracking-widest",
            )}
          >
            ယခု ပြသနေသည်
          </p>
        </div>
      </div>

      <div
        className={classNames(
          "relative w-full h-full max-w-6xl mx-auto rounded-3xl overflow-hidden",
          "shadow-[0_0_100px_rgba(229,9,20,0.1)] border border-white/5",
        )}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className={classNames("w-full h-full border-0")}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className={classNames(
              "absolute inset-0 bg-[#050505] flex items-center justify-center",
            )}
          >
            <img
              src={movie.backdropUrl}
              alt="Video Backdrop"
              className={classNames(
                "absolute inset-0 w-full h-full object-cover opacity-20 blur-xl",
              )}
              referrerPolicy="no-referrer"
            />
            <div className={classNames("relative z-10 text-center px-6")}>
              <div
                className={classNames(
                  "w-24 h-24 bg-accent/20 rounded-full flex items-center",
                  "justify-center mx-auto mb-8 animate-pulse text-accent",
                )}
              >
                <Play className={classNames("w-10 h-10 fill-current")} />
              </div>
              <h3
                className={classNames(
                  "text-3xl font-black uppercase tracking-tighter mb-4",
                )}
              >
                ရုပ်ရှင်ကို ဖွင့်ရန် ပြင်ဆင်နေပါသည်...
              </h3>
              <p
                className={classNames(
                  "text-ink-secondary text-sm max-w-sm mx-auto",
                )}
              >
                ဤသည်မှာ ရုပ်ရှင်ပြသရန် နမူနာသာ ဖြစ်ပါသည်။ လက်တွေ့တွင်မူ
                သင့်အတွက် အရည်အသွေးမြင့် ရုပ်ရှင်ကို တိုက်ရိုက်ပြသပေးမည်
                ဖြစ်ပါသည်။
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
