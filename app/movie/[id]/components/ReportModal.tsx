"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { Input, LoadingButton, Textarea } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useWrite } from "@/lib/spoosh";

interface ReportModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const DEFAULT_REASON = "Broken Link / Video";

export const ReportModal = ({ isOpen, title, onClose }: ReportModalProps) => {
  const [reason, setReason] = useState(DEFAULT_REASON);
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trigger, loading } = useWrite((api) => api("reports").POST());

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description.trim()) return;

    const result = await trigger({ body: { title, reason, description } });
    if (result.data) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setDescription("");
        onClose();
      }, 2500);
    }
  };

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
          "bg-[#111] w-full max-w-md rounded-[2rem] p-6 lg:p-8",
          "border border-white/5 relative overflow-hidden mx-4",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={classNames(
            "absolute top-6 right-6 p-2 text-white/30 hover:text-white",
            "transition-colors",
          )}
        >
          <X className={classNames("w-6 h-6")} />
        </button>

        {isSubmitted ? (
          <div
            className={classNames(
              "py-10 text-center flex flex-col items-center gap-6",
            )}
          >
            <div
              className={classNames(
                "w-20 h-20 bg-amber-500/20 rounded-full",
                "flex items-center justify-center text-amber-500",
              )}
            >
              <CheckCircle2 className={classNames("w-10 h-10")} />
            </div>
            <div>
              <h3
                className={classNames(
                  "text-2xl font-black uppercase tracking-tighter mb-2",
                )}
              >
                တိုင်ကြားမှု လက်ခံရရှိပါသည်
              </h3>
              <p
                className={classNames("text-ink-secondary text-xs lg:text-sm")}
              >
                ကျွန်ုပ်တို့အဖွဲ့မှ{" "}
                <span className={classNames("text-white font-bold")}>
                  "{title}"
                </span>
                နဲ့ ပတ်သက်တဲ့ ပြဿနာကို စစ်ဆေးနေပါပြီ။
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={classNames("mb-6 lg:mb-8")}>
              <div className={classNames("flex items-center gap-2 mb-2")}>
                <AlertCircle className={classNames("w-4 h-4 text-amber-500")} />
                <span
                  className={classNames(
                    "text-[10px] font-black uppercase tracking-[0.3em] text-white/30",
                  )}
                >
                  အရည်အသွေး ထိန်းသိမ်းခြင်း
                </span>
              </div>
              <h2
                className={classNames(
                  "text-2xl lg:text-3xl font-black uppercase tracking-tighter",
                )}
              >
                တစ်ခုခု အဆင်မပြေဖြစ်နေပါသလား?
              </h2>
              <p
                className={classNames(
                  "text-ink-secondary text-xs lg:text-sm mt-2 font-mono",
                )}
              >
                တိုင်ကြားရန် - {title}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={classNames("space-y-6")}>
              <div className={classNames("space-y-2")}>
                <label
                  className={classNames(
                    "text-[10px] font-black uppercase tracking-widest",
                    "text-white/50 ml-1",
                  )}
                >
                  ပြဿနာအမျိုးအစား
                </label>
                <Input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className={classNames(
                    "w-full bg-white/5 border border-white/5 rounded-2xl",
                    "py-4 px-6 text-sm font-bold placeholder:text-white/10",
                    "focus-within:ring-1 focus-within:ring-accent/30",
                    "focus-within:bg-white/10 transition-all",
                  )}
                  inputClassName={classNames("bg-transparent", "text-white")}
                />
              </div>

              <div className={classNames("space-y-2")}>
                <label
                  className={classNames(
                    "text-[10px] font-black uppercase tracking-widest",
                    "text-white/50 ml-1",
                  )}
                >
                  အသေးစိတ်
                </label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="ဖြစ်နေတဲ့ ပြဿနာကို ရေးပေးပါ..."
                  className={classNames(
                    "w-full bg-white/5 border border-white/5 rounded-2xl",
                    "py-4 px-6 text-sm font-bold placeholder:text-white/10",
                    "focus-within:ring-1 focus-within:ring-accent/30",
                    "focus-within:bg-white/10 transition-all resize-none",
                  )}
                />
              </div>

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Sending..."
                disabled={!description.trim()}
                className={classNames(
                  "w-full bg-amber-500 text-black py-5 rounded-2xl",
                  "font-black uppercase tracking-widest flex items-center",
                  "justify-center gap-3 hover:scale-[1.02] active:scale-95",
                  "transition-all disabled:opacity-50 disabled:hover:scale-100",
                  "shadow-xl shadow-amber-500/10",
                )}
              >
                <AlertCircle className={classNames("w-5 h-5")} />
                <span>တိုင်ကြားစာ ပို့မည်</span>
              </LoadingButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
