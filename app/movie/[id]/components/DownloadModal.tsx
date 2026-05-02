"use client";

import { Download, X } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import type { DownloadLink } from "@/types/content";
import { classNames } from "@/utils/classNames";

interface DownloadModalProps {
  isOpen: boolean;
  title: string;
  links: DownloadLink[] | undefined;
  onClose: () => void;
}

export const DownloadModal = ({
  isOpen,
  title,
  links,
  onClose,
}: DownloadModalProps) => {
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
          "bg-[#111] w-full max-w-md rounded-[2rem] lg:rounded-[2.5rem]",
          "p-6 lg:p-10 border border-white/5 relative mx-4",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="icon"
          onClick={onClose}
          className={classNames(
            "absolute top-6 lg:top-8 right-6 lg:right-8",
            "p-2 text-white/30 hover:text-white transition-colors",
          )}
        >
          <X className={classNames("w-5 h-5 lg:w-6 lg:h-6")} />
        </Button>

        <div className={classNames("mb-6 lg:mb-10 text-center")}>
          <div
            className={classNames(
              "w-12 h-12 lg:w-16 lg:h-16 bg-accent/20 rounded-xl",
              "lg:rounded-2xl flex items-center justify-center mx-auto",
              "mb-4 lg:mb-6 text-accent",
            )}
          >
            <Download className={classNames("w-6 h-6 lg:w-8 lg:h-8")} />
          </div>
          <h2
            className={classNames(
              "text-xl lg:text-3xl font-black uppercase tracking-tighter",
            )}
          >
            ကြည်လင်ပြတ်သားမှု ရွေးချယ်ပါ
          </h2>
          <p
            className={classNames("text-ink-secondary text-xs lg:text-sm mt-2")}
          >
            {title} ကို သင့်ဖုန်းနဲ့ ကိုက်ညီမယ့် ဖိုင်ဆိုဒ်ကို ရွေးချယ်ပါ။
          </p>
        </div>

        <div className={classNames("space-y-3 lg:space-y-4")}>
          {links && links.length > 0 ? (
            links.map((link, index) => (
              <a
                key={`${link.quality}-${index}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={classNames(
                  "w-full flex items-center justify-between p-4 lg:p-6",
                  "bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl",
                  "border border-white/5 transition-all group",
                )}
              >
                <div className={classNames("text-left")}>
                  <div
                    className={classNames(
                      "text-xs lg:text-sm font-black uppercase tracking-widest",
                      "text-white group-hover:text-accent transition-colors",
                    )}
                  >
                    {link.quality}
                  </div>
                  <div
                    className={classNames(
                      "text-[9px] lg:text-[10px] font-bold uppercase tracking-widest",
                      "text-white/30",
                    )}
                  >
                    Direct Download
                  </div>
                </div>
                <div
                  className={classNames(
                    "text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em]",
                    "text-accent/80",
                  )}
                >
                  {link.size}
                </div>
              </a>
            ))
          ) : (
            <div
              className={classNames(
                "py-10 text-center text-white/20 uppercase font-black",
                "text-[10px] tracking-widest",
              )}
            >
              ဒေါင်းလုဒ်လင့်ခ် မရှိသေးပါ
            </div>
          )}
        </div>

        <p
          className={classNames(
            "mt-8 text-center text-[10px] font-black uppercase",
            "tracking-[0.3em] text-white/10",
          )}
        >
          ပိတ်ကား - လုံခြုံစိတ်ချရသော ဒေါင်းလုဒ်စနစ်
        </p>
      </div>
    </div>
  );
};
