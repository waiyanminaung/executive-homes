"use client";

import { PawPrint } from "lucide-react";
import { classNames } from "@/utils/classNames";

interface HomePetToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function HomePetToggle({ value, onChange }: HomePetToggleProps) {
  const thumb = (
    <span
      className={classNames(
        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-white",
        value ? "text-primary-500" : "text-neutral-400",
      )}
    >
      <PawPrint className="h-4 w-4" />
    </span>
  );

  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={classNames(
        "flex h-[34px] items-center gap-1 rounded-full transition-colors duration-200",
        value
          ? "bg-gradient-to-b from-primary-500 to-primary-400 pl-2 pr-0.5"
          : "bg-neutral-300 pl-0.5 pr-2",
      )}
    >
      {value ? (
        <>
          <span className="px-1 text-[13px] font-semibold text-white">Pet</span>
          {thumb}
        </>
      ) : (
        <>
          {thumb}
          <span className="px-1 text-[13px] font-semibold text-white">Pet</span>
        </>
      )}
    </button>
  );
}
