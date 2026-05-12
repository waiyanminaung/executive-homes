"use client";

import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  LoadingButton,
  RHFInput,
  RHFSelect,
  RHFTextarea,
  RHFInputGroup,
  SelectOption,
} from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import { useWrite } from "@/lib/spoosh";
import { reportSchema, type ReportInput } from "@/validation/reportSchema";

interface ReportModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

const labelClassName =
  "text-[10px] font-black uppercase tracking-widest text-white/50";
const errorClassName = "text-red-400 text-xs font-semibold";

const REPORT_REASONS = [
  "လင့်ခ်ပျက်နေသည် / ဗီဒီယိုကြည့်မရပါ",
  "စာတန်းထိုး မပါပါ",
  "ရုပ်ရှင် မှားယွင်းနေသည်",
  "အရုပ်မကြည်လင်ပါ",
  "အခြား / အကြံပြုချက်",
];
const DEFAULT_REASON = REPORT_REASONS[0];

export const ReportModal = ({ isOpen, title, onClose }: ReportModalProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const methods = useForm<ReportInput>({
    values: {
      title,
      reason: DEFAULT_REASON,
      description: "",
    },
    resolver: zodResolver(reportSchema) as unknown as Resolver<ReportInput>,
  });
  const description = useWatch({
    control: methods.control,
    name: "description",
  });
  const { trigger, loading } = useWrite((api) => api("reports").POST());

  if (!isOpen) return null;

  const handleSubmit = methods.handleSubmit(async (values) => {
    if (!values.description.trim()) return;

    const result = await trigger({ body: values });
    if (result.data) {
      setIsSubmitted(true);
      methods.reset({
        title,
        reason: DEFAULT_REASON,
        description: "",
      });
      setTimeout(() => {
        setIsSubmitted(false);
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
        <button
          type="button"
          onClick={onClose}
          className={classNames(
            "absolute top-5 right-5 p-2 text-white/30 hover:text-white",
            "transition-colors",
          )}
        >
          <X className={classNames("w-5 h-5")} />
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
                  "text-xl font-black uppercase tracking-tighter mb-1",
                )}
              >
                တိုင်ကြားမှု လက်ခံရရှိပါသည်
              </h3>
              <p
                className={classNames("text-ink-secondary text-xs lg:text-sm")}
              >
                ကျွန်ုပ်တို့အဖွဲ့မှ{" "}
                <span className={classNames("text-white font-bold")}>
                  &quot;{title}&quot;
                </span>
                နဲ့ ပတ်သက်တဲ့ ပြဿနာကို စစ်ဆေးနေပါပြီ။
              </p>
            </div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <div className={classNames("mb-4 lg:mb-5")}>
              <div className={classNames("flex items-center gap-2 mb-1")}>
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
                  "text-xl lg:text-2xl font-black uppercase tracking-tighter",
                )}
              >
                တစ်ခုခု အဆင်မပြေဖြစ်နေပါသလား?
              </h2>
              <p
                className={classNames(
                  "text-ink-secondary text-xs lg:text-sm mt-1 font-mono leading-snug",
                )}
              >
                တိုင်ကြားရန် - {title}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={classNames("space-y-4")}>
              <RHFInput name="title" type="hidden" className="hidden" />
              <RHFInputGroup
                label="ပြဿနာအမျိုးအစား"
                labelClassName={labelClassName}
                errorClassName={errorClassName}
              >
                <RHFSelect
                  name="reason"
                  className={classNames(
                    "w-full rounded-2xl border border-white/5 bg-white/5",
                    "text-sm font-bold",
                  )}
                >
                  {REPORT_REASONS.map((option) => (
                    <SelectOption key={option} value={option} label={option} />
                  ))}
                </RHFSelect>
              </RHFInputGroup>

              <RHFInputGroup
                label="အသေးစိတ်"
                labelClassName={labelClassName}
                errorClassName={errorClassName}
              >
                <RHFTextarea
                  name="description"
                  rows={3}
                  placeholder="ဖြစ်နေတဲ့ ပြဿနာကို ရေးပေးပါ..."
                  className={classNames(
                    "w-full bg-white/5 border border-white/5 rounded-2xl",
                    "py-3 px-6 text-sm font-bold placeholder:text-white/10",
                    "focus-within:ring-1 focus-within:ring-accent/30",
                    "focus-within:bg-white/10 transition-all resize-none",
                  )}
                />
              </RHFInputGroup>

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="Sending..."
                disabled={!description?.trim()}
                className={classNames(
                  "w-full bg-amber-500 text-black py-3 rounded-2xl",
                  "font-black uppercase tracking-widest flex items-center",
                  "justify-center gap-3 hover:scale-[1.02] active:scale-95",
                  "transition-all disabled:opacity-50 disabled:hover:scale-100",
                  "shadow-xl shadow-amber-500/10 text-[10px] lg:text-xs",
                )}
              >
                <AlertCircle className={classNames("w-4 h-4")} />
                <span>တိုင်ကြားစာ ပို့မည်</span>
              </LoadingButton>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
};
