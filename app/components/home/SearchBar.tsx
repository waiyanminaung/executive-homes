"use client";

import { Search } from "lucide-react";
import { Input } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const HomeSearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div
      className={classNames("mt-2 lg:mt-8 relative group max-w-4xl mx-auto")}
    >
      <Search
        className={classNames(
          "absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5",
          "text-ink-secondary group-focus-within:text-accent transition-colors",
        )}
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ရုပ်ရှင်နှင့် ဇာတ်လမ်းတွဲများ ရှာဖွေပါ..."
        className={classNames(
          "w-full bg-card border-none rounded-xl py-4 lg:py-5",
          "pl-12 lg:pl-14 pr-6 text-sm lg:text-base font-medium",
          "placeholder:text-white/10 focus-within:ring-1 focus-within:ring-accent/30",
          "outline-none transition-all shadow-lg",
        )}
        inputClassName={classNames("bg-transparent", "text-white")}
      />
    </div>
  );
};
