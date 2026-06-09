"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LoadingButton, RHFInput, RHFTextarea } from "@geckoui/geckoui";
import { Send } from "lucide-react";
import { enquirySchema, type EnquiryFormValues } from "@/validation/enquirySchema";
import { classNames } from "@/utils/classNames";

const fieldClassName = classNames(
  "rounded-lg border border-gray-300 bg-white px-[18px] py-[11px]",
  "text-sm text-neutral-900 shadow-none transition-colors",
  "focus-within:border-primary-500",
);

interface PropertyEnquiryFormProps {
  dismiss: () => void;
}

export function PropertyEnquiryForm({ dismiss }: PropertyEnquiryFormProps) {
  const methods = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    values: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleSubmit = methods.handleSubmit(() => {
    methods.reset();
    dismiss();
  });

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-[540px] rounded-2xl bg-white p-[6px]">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-500">
            Property Enquiry
          </p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950">
            Send an Enquiry
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Fill in your details and we&apos;ll get back to you shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <RHFInput name="name" placeholder="Full Name" className={fieldClassName} />
            <RHFInput name="email" type="email" placeholder="Email Address" className={fieldClassName} />
          </div>

          <RHFInput name="phone" placeholder="Phone Number" className={fieldClassName} />

          <RHFTextarea
            name="message"
            placeholder="Message"
            rows={4}
            className={classNames(fieldClassName, "min-h-[100px]")}
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={dismiss}
              className="h-11 flex-1 rounded-lg border border-gray-300 text-sm font-semibold text-neutral-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>

            <LoadingButton
              type="submit"
              className="h-11 flex-1 rounded-lg bg-primary-500 text-sm font-semibold !text-white transition-colors hover:bg-primary-600"
            >
              <Send className="h-4 w-4" />
              <span>Submit</span>
            </LoadingButton>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
