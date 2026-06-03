"use client";

import { Input } from "@geckoui/geckoui";
import { Controller, type Control, type FieldPath } from "react-hook-form";
import { classNames } from "@/utils/classNames";
import { type AdminRegisterFormValues } from "@/validation/authSchema";

interface AdminRegisterFieldProps {
  control: Control<AdminRegisterFormValues>;
  name: FieldPath<AdminRegisterFormValues>;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
}

export default function AdminRegisterField({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: AdminRegisterFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={classNames("space-y-2")}>
          <label
            htmlFor={name}
            className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1"
          >
            {label}
          </label>

          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-1.5 px-4 focus-within:ring-1 focus-within:ring-accent/30 transition-all"
            inputClassName="py-4 font-bold placeholder:text-white/20"
          />

          {fieldState.error?.message ? (
            <p className="text-red-400 text-xs font-semibold">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
