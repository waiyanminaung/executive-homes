"use client";

import { useState, useEffect } from "react";

export function useAnimatedPlaceholder(phrases: string[], active: boolean): string {
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setPlaceholder(""), 0);
      return () => clearTimeout(timer);
    }

    let phraseIdx = 0;
    let charIdx = 0;
    let pausing = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIdx];

      if (pausing) {
        pausing = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setPlaceholder("");
        timer = setTimeout(tick, 300);
        return;
      }

      if (charIdx < phrase.length) {
        setPlaceholder(phrase.slice(0, charIdx + 1));
        charIdx++;
        timer = setTimeout(tick, 80);
      } else {
        pausing = true;
        timer = setTimeout(tick, 2000);
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [active, phrases]);

  return placeholder;
}
