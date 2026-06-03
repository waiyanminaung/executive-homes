"use client";

import Image from "next/image";
import { classNames } from "@/utils/classNames";
import { useInView } from "@/hooks/useInView";
import { WHY_EXECUTIVE_HOMES_ITEMS } from "@/app/constants";

export function WhyExecutiveHomes() {
  const { ref, inView } = useInView();

  return (
    <section className="relative mt-10 overflow-hidden bg-muted py-14 md:mt-14 md:py-[90px]">
      <Image
        src="/logo-icon.svg"
        alt=""
        width={350}
        height={404}
        aria-hidden
        className="absolute left-1/2 top-[42px] w-[240px] -translate-x-1/2 opacity-[0.08] [filter:invert(63%)_sepia(30%)_saturate(700%)_hue-rotate(5deg)] md:w-[350px]"
      />

      <div className="container relative mx-auto px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-950 md:text-[28px]">Why Executive Homes?</h2>
          <p className="mx-auto mt-2 max-w-[320px] text-base font-medium text-neutral-800 md:max-w-none md:text-lg">
            Find the most suitable property at the best available price
          </p>
        </div>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6"
        >
          {WHY_EXECUTIVE_HOMES_ITEMS.map((item, i) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                style={{ animationDelay: `${i * 150}ms` }}
                className={classNames(
                  "flex items-center justify-between gap-4 rounded-2xl bg-white/80 p-6 md:gap-6 md:p-10",
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
                <Icon className="h-16 w-16 shrink-0 text-primary-500/80 md:h-[90px] md:w-[90px]" strokeWidth={1} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
