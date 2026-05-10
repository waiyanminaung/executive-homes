"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { classNames } from "@/utils/classNames";

interface PKVideoControlButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  label?: string;
}

export const PKVideoControlButton = forwardRef<
  HTMLButtonElement,
  PKVideoControlButtonProps
>(function PKVideoControlButton(
  {
    children,
    label,
    className,
    type = "button",
    "aria-label": ariaLabel,
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel ?? label}
      className={classNames(
        "size-8",
        "inline-flex items-center justify-center",
        "rounded-full bg-transparent p-0 text-white",
        "transition",
        "hover:bg-white/10 active:scale-100",
        "focus:outline-none focus-visible:outline-none focus-visible:ring-0",
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
});
