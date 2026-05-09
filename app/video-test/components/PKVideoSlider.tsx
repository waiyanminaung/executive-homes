"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { classNames } from "@/utils/classNames";

interface PKVideoSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  ariaLabel: string;
  onChange: (value: number) => void;
  onInteractionEnd?: () => void;
  onInteractionStart?: () => void;
  onInteraction?: () => void;
  className?: string;
  style?: SliderStyle;
}

type SliderStyle = CSSProperties & {
  "--pk-range-progress"?: string;
  "--pk-range-buffer"?: string;
};

export const PKVideoSlider = ({
  min,
  max,
  step = 1,
  value,
  ariaLabel,
  onChange,
  onInteractionEnd,
  onInteractionStart,
  onInteraction,
  className,
  style,
}: PKVideoSliderProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const range = max - min;
  const progress = range > 0 ? ((value - min) / range) * 100 : 0;
  const sliderStyle: SliderStyle = {
    ...style,
    "--pk-range-progress": `${progress}%`,
  };

  const clamp = (nextValue: number) => Math.min(max, Math.max(min, nextValue));

  const snapToStep = (nextValue: number) => {
    if (!Number.isFinite(step) || step <= 0) {
      return clamp(nextValue);
    }

    const stepped = Math.round((nextValue - min) / step) * step + min;

    return clamp(stepped);
  };

  const updateFromClientX = (clientX: number) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const rect = slider.getBoundingClientRect();
    const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    const clampedRatio = Math.min(1, Math.max(0, ratio));
    const nextValue = min + clampedRatio * range;

    onChange(snapToStep(nextValue));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    onInteractionStart?.();
    onInteraction?.();
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    onInteraction?.();
    updateFromClientX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
    onInteractionEnd?.();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
    onInteractionEnd?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let nextValue = value;

    if (event.key === "ArrowRight") {
      nextValue = value + step;
    }

    if (event.key === "ArrowLeft") {
      nextValue = value - step;
    }

    if (event.key === "Home") {
      nextValue = min;
    }

    if (event.key === "End") {
      nextValue = max;
    }

    if (nextValue === value) {
      return;
    }

    event.preventDefault();
    onInteraction?.();
    onChange(snapToStep(nextValue));
  };

  return (
    <div
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className={classNames("pk-video-timeline", className)}
      style={sliderStyle}
      onClick={(event) => event.stopPropagation()}
      onFocus={onInteraction}
      onBlur={onInteractionEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
    >
      <div
        className={classNames("pk-video-timeline__track")}
        aria-hidden="true"
      >
        <div className={classNames("pk-video-timeline__buffer")} />
        <div className={classNames("pk-video-timeline__fill")} />
      </div>
      <div
        className={classNames("pk-video-timeline__thumb")}
        aria-hidden="true"
      />
    </div>
  );
};
