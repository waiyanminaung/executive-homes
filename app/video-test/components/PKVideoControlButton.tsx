"use client";

import type { ReactNode } from "react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface PKVideoControlButtonProps {
  children: ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}

export const PKVideoControlButton = ({
  children,
  label,
  className,
  onClick,
}: PKVideoControlButtonProps) => {
  return (
    <Button
      type="button"
      variant="icon"
      onClick={onClick}
      aria-label={label}
      className={classNames(
        "size-8",
        "rounded-full bg-transparent p-0 text-white",
        "hover:bg-white/10 active:scale-100",
        "focus:outline-none focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
    >
      {children}
    </Button>
  );
};
