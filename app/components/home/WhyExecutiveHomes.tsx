"use client";

import Image from "next/image";
import { classNames } from "@/utils/classNames";
import { useInView } from "@/hooks/useInView";
import { WHY_EXECUTIVE_HOMES_ITEMS } from "@/app/constants";

export function WhyExecutiveHomes() {
  const { ref, inView } = useInView();

  return (
    <section className="relative mt-14 overflow-hidden bg-muted py-[90px]">
      <Image
        src="/logo-icon.svg"
        alt=""
        width={350}
        height={404}
        aria-hidden
        className="absolute left-1/2 top-[42px] -translate-x-1/2 opacity-[0.08] [filter:invert(63%)_sepia(30%)_saturate(700%)_hue-rotate(5deg)]"
      />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-neutral-950">Why Executive Homes?</h2>
          <p className="mt-2 text-lg font-medium text-neutral-800">
            Find the most suitable property at the best available price
          </p>
        </div>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {WHY_EXECUTIVE_HOMES_ITEMS.map((item, i) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                style={{ animationDelay: `${i * 150}ms` }}
                className={classNames(
                  "flex items-center justify-between gap-6 rounded-2xl bg-white/80 p-10",
                  "shadow-[0_4px_12px_rgb(17_24_39/0.08)] transition-shadow hover:shadow-[0_8px_20px_rgb(17_24_39/0.12)]",
                  inView ? "animate-fade-up" : "opacity-0",
                )}
              >
                <div>
                  <h3 className="text-lg font-bold text-neutral-950">{item.title}</h3>
                  <p className="mt-3 text-base font-normal leading-6 text-neutral-800">
                    {item.description}
                  </p>
                </div>
                <Icon className="h-[90px] w-[90px] shrink-0 text-primary-500/80" strokeWidth={1} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
