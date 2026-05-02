"use client";

import { useState } from "react";
import { CheckCircle2, PlusCircle, Send, X } from "lucide-react";
import { Button, Input, LoadingButton } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useWrite } from "@/lib/spoosh";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestModal = ({ isOpen, onClose }: RequestModalProps) => {
  const [title, setTitle] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trigger, loading } = useWrite((api) => api("requests").POST());

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    const result = await trigger({ body: { title } });
    if (result.data) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setTitle("");
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
        {isSubmitted ? (
          <div
            className={classNames(
              "py-10 text-center flex flex-col items-center gap-6",
            )}
          >
            <div
              className={classNames(
                "w-20 h-20 bg-accent/20 rounded-full",
                "flex items-center justify-center text-accent",
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
                တောင်းဆိုမှု ပေးပို့ပြီးပါပြီ!
              </h3>
              <p className={classNames("text-ink-secondary text-sm")}>
                ကျွန်ုပ်တို့ မကြာမီ{" "}
                <span className={classNames("text-white font-bold")}>
                  "{title}"
                </span>
                ကို ထည့်သွင်းပေးပါမည်။
              </p>
            </div>
          </div>
        ) : (
          <>
            <Button
              type="button"
              variant="icon"
              onClick={onClose}
              className={classNames(
                "absolute top-6 right-6 p-2 text-white/30 hover:text-white",
                "transition-colors",
              )}
            >
              <X className={classNames("w-6 h-6")} />
            </Button>

            <div className={classNames("mb-6 lg:mb-8")}>
              <div className={classNames("flex items-center gap-2 mb-2")}>
                <PlusCircle className={classNames("w-4 h-4 text-accent")} />
                <span
                  className={classNames(
                    "text-[10px] font-black uppercase tracking-[0.3em] text-white/30",
                  )}
                >
                  ရုပ်ရှင်တောင်းဆိုခြင်း
                </span>
              </div>
              <h2
                className={classNames(
                  "text-2xl lg:text-3xl font-black uppercase tracking-tighter",
                )}
              >
                ရုပ်ရှင်ရှာမတွေ့ဘူးလား?
              </h2>
              <p
                className={classNames(
                  "text-ink-secondary text-xs lg:text-sm mt-2",
                )}
              >
                ပိတ်ကား မှာ ကြည့်ချင်တဲ့ ရုပ်ရှင်ရှိရင် ပြောပြပေးပါ။
                အကောင့်ဝင်စရာ မလိုပါ။
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={classNames("space-y-4 lg:space-y-6")}
            >
              <div className={classNames("space-y-2")}>
                <label
                  className={classNames(
                    "text-[9px] lg:text-[10px] font-black uppercase tracking-widest",
                    "text-white/50 ml-1",
                  )}
                >
                  ရုပ်ရှင်အမည်
                </label>
                <Input
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="ဘာထပ်ထည့်ပေးရမလဲ?"
                  className={classNames(
                    "w-full bg-white/5 border border-white/5 rounded-2xl",
                    "py-4 lg:py-5 px-6 text-base lg:text-lg font-bold",
                    "placeholder:text-white/10 focus-within:ring-1",
                    "focus-within:ring-accent/30 focus-within:bg-white/10",
                    "transition-all",
                  )}
                  inputClassName={classNames("bg-transparent", "text-white")}
                />
              </div>

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Sending..."
                disabled={!title.trim()}
                className={classNames(
                  "w-full bg-accent text-white py-4 lg:py-5 rounded-2xl",
                  "font-black uppercase tracking-widest flex items-center",
                  "justify-center gap-3 hover:scale-[1.02] active:scale-95",
                  "transition-all disabled:opacity-50 disabled:hover:scale-100",
                  "shadow-xl shadow-accent/20 text-xs lg:text-sm",
                )}
              >
                <Send className={classNames("w-4 h-4 lg:w-5 lg:h-5")} />
                <span>တောင်းဆိုရန်</span>
              </LoadingButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
