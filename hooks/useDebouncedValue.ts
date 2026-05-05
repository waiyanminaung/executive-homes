"use client";

import { useEffect, useState } from "react";

export const useDebouncedValue = <TValue>(
  value: TValue,
  delayMs: number,
): TValue => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const delay = typeof value === "string" && !value ? 0 : delayMs;
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, value]);

  return debouncedValue;
};
