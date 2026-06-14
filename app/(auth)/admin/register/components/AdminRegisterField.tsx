"use client";

import { RHFInput, RHFError } from "@geckoui/geckoui";
import { type FieldPath } from "react-hook-form";
import { type AdminRegisterFormValues } from "@/validation/authSchema";

interface AdminRegisterFieldProps {
  name: FieldPath<AdminRegisterFormValues>;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
}

export default function AdminRegisterField({
  name,
  label,
  placeholder,
  type = "text",
}: AdminRegisterFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <RHFInput name={name} id={name} type={type} placeholder={placeholder} />
      <RHFError name={name} />
    </div>
  );
}
