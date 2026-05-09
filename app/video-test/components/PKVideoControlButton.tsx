"use client";

import type { ReactNode } from "react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";

interface PKVideoControlButtonProps {
  children: ReactNode;
  label: string;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export const PKVideoControlButton = ({
  children,
  label,
  size = "md",
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
        size === "lg" ? "size-8" : "size-7",
        "rounded-lg bg-transparent p-0 text-white",
        "hover:bg-white/10 active:scale-100",
        "focus:outline-none focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
    >
      {children}
    </Button>
  );
};
