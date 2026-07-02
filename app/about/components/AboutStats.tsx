import type { AboutStat } from "../types";

interface AboutStatsProps {
  stats: AboutStat[];
}

export function AboutStats({ stats }: AboutStatsProps) {
  return (
    <section className="px-4 py-8 md:py-[70px]">
      <div className="mx-auto grid w-full max-w-[1235px] grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-h-[110px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-detail-card border-t-2 border-t-primary-500 md:min-h-[162px] md:p-10"
          >
            <p className="text-xl font-semibold leading-[1.4] text-primary-500 md:text-[32px] md:leading-[1.5]">
              {stat.value}
            </p>
            <p className="text-xs leading-[1.4] text-neutral-600 md:text-base md:leading-[1.5]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
