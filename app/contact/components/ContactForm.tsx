"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { LoadingButton, RHFInput, RHFTextarea } from "@geckoui/geckoui";
import { Send } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/validation/contactSchema";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";

const fieldClassName = classNames(
  "rounded-lg border border-gray-400 bg-white px-[18px] py-[11px]",
  "text-sm text-neutral-900 shadow-none transition-colors",
  "focus-within:border-primary-500",
);

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { trigger: submitEnquiry } = useWrite((api) => api("enquiries").POST());

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    values: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await submitEnquiry({ body: { ...values, phone: values.phone || undefined } });
    setSubmitted(true);
    methods.reset();
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-detail-card md:p-8"
      >
        <div className="mb-4 md:mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-500 md:text-sm">
            Send an inquiry
          </p>
          <h2 className="mt-1.5 text-xl font-bold text-neutral-950 md:mt-2 md:text-[30px]">
            Tell us what you need
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 md:mt-3 md:text-base md:leading-7">
            Share your preferred area, budget, and timeline. Our team will help match you with the right Bangkok property.
          </p>
        </div>

        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          <RHFInput name="name" placeholder="Name" className={fieldClassName} />
          <RHFInput name="email" type="email" placeholder="Email Address" className={fieldClassName} />
          <RHFInput name="phone" placeholder="Phone Number" className={fieldClassName} />
          <RHFInput name="subject" placeholder="Subject" className={fieldClassName} />
          <RHFTextarea
            name="message"
            placeholder="Message"
            rows={4}
            className={classNames(fieldClassName, "min-h-[118px] md:col-span-2")}
          />
        </div>

        {submitted ? (
          <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm font-medium text-primary-700">
            Thank you. We received your inquiry and will contact you shortly.
          </p>
        ) : null}

        <LoadingButton
          type="submit"
          loading={methods.formState.isSubmitting}
          className="mt-4 h-11 w-full rounded-lg bg-primary-500 text-sm font-semibold !text-white transition-colors hover:bg-primary-600 md:mt-6 md:h-12 md:text-base"
        >
          <Send className="h-4 w-4" />
          <span>Submit</span>
        </LoadingButton>
      </form>
    </FormProvider>
  );
}
