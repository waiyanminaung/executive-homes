import type { AboutStat } from "../types";

interface AboutStatsProps {
  stats: AboutStat[];
}

export function AboutStats({ stats }: AboutStatsProps) {
  return (
    <section className="px-4 py-[70px]">
      <div className="mx-auto grid w-full max-w-[1235px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-h-[162px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-detail-card border-t-2 border-t-primary-500"
          >
            <p className="text-[32px] font-semibold leading-[1.5] text-primary-500">
              {stat.value}
            </p>
            <p className="text-base leading-[1.5] text-neutral-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
