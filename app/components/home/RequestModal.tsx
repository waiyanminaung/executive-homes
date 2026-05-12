"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, PlusCircle, Send, X } from "lucide-react";
import {
  Button,
  LoadingButton,
  RHFInput,
  RHFInputGroup,
} from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useWrite } from "@/lib/spoosh";
import { requestSchema, type RequestInput } from "@/validation/requestSchema";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const labelClassName =
  "text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/50";
const errorClassName = "text-red-400 text-xs font-semibold";

export const RequestModal = ({ isOpen, onClose }: RequestModalProps) => {
  const [submittedTitle, setSubmittedTitle] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const methods = useForm<RequestInput>({
    values: {
      title: "",
    },
    resolver: zodResolver(requestSchema) as unknown as Resolver<RequestInput>,
  });
  const title = useWatch({ control: methods.control, name: "title" }) ?? "";
  const { trigger, loading } = useWrite((api) => api("requests").POST());

  if (!isOpen) return null;

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (!values.title.trim()) return;

    const result = await trigger({ body: values });
    if (result.data) {
      setSubmittedTitle(values.title);
      setIsSubmitted(true);
      methods.reset({ title: "" });
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmittedTitle("");
        onClose();
      }, 2500);
    }
  });

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
          "bg-[#111] w-full max-w-md rounded-[2rem] p-5 lg:p-6",
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
                  "text-xl font-black uppercase tracking-tighter mb-1",
                )}
              >
                တောင်းဆိုမှု ပေးပို့ပြီးပါပြီ!
              </h3>
              <p
                className={classNames(
                  "text-ink-secondary text-xs leading-snug",
                )}
              >
                ကျွန်ုပ်တို့ မကြာမီ{" "}
                <span className={classNames("text-white font-bold")}>
                  &quot;{submittedTitle}&quot;
                </span>
                ကို ထည့်သွင်းပေးပါမည်။
              </p>
            </div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <Button
              type="button"
              variant="icon"
              onClick={onClose}
              className={classNames(
                "absolute top-5 right-5 p-2 text-white/30 hover:text-white",
                "transition-colors",
              )}
            >
              <X className={classNames("w-5 h-5")} />
            </Button>

            <div className={classNames("mb-4 lg:mb-5")}>
              <div className={classNames("flex items-center gap-2 mb-1")}>
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
                  "text-xl lg:text-2xl font-black uppercase tracking-tighter",
                )}
              >
                ရုပ်ရှင်ရှာမတွေ့ဘူးလား?
              </h2>
              <p
                className={classNames(
                  "text-ink-secondary text-xs lg:text-sm mt-1 leading-snug",
                )}
              >
                ပိတ်ကား မှာ ကြည့်ချင်တဲ့ ရုပ်ရှင်ရှိရင် ပြောပြပေးပါ။
                အကောင့်ဝင်စရာ မလိုပါ။
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={classNames("space-y-3 lg:space-y-4")}
            >
              <RHFInputGroup
                label="ရုပ်ရှင်အမည်"
                labelClassName={labelClassName}
                errorClassName={errorClassName}
              >
                <RHFInput
                  name="title"
                  autoFocus
                  placeholder="ဘာထပ်ထည့်ပေးရမလဲ?"
                  className={classNames(
                    "w-full bg-white/5 border border-white/5 rounded-2xl",
                    "py-3 lg:py-4 px-6 text-sm lg:text-base font-bold",
                    "placeholder:text-white/10 focus-within:ring-1",
                    "focus-within:ring-accent/30 focus-within:bg-white/10",
                    "transition-all",
                  )}
                  inputClassName={classNames("bg-transparent", "text-white")}
                />
              </RHFInputGroup>

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Sending..."
                disabled={!title.trim()}
                className={classNames(
                  "w-full bg-accent text-white py-3 lg:py-4 rounded-2xl",
                  "font-black uppercase tracking-widest flex items-center",
                  "justify-center gap-3 hover:scale-[1.02] active:scale-95",
                  "transition-all disabled:opacity-50 disabled:hover:scale-100",
                  "shadow-xl shadow-accent/20 text-[10px] lg:text-xs",
                )}
              >
                <Send className={classNames("w-4 h-4")} />
                <span>တောင်းဆိုရန်</span>
              </LoadingButton>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
};
