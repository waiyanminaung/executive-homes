import Image from "next/image";
import { classNames } from "@/utils/classNames";
import type { AreaCard } from "@/app/types";

interface AreaGridProps {
  areas: AreaCard[];
}

function AreaCard({ area, tall }: { area: AreaCard; tall?: boolean }) {
  return (
    <article
      className={classNames(
        "group relative min-h-[180px] overflow-hidden rounded-xl shadow-sm",
        tall && "lg:min-h-[372px]",
      )}
    >
      <Image
        src={area.imageUrl}
        alt={area.name}
        fill
        sizes="(min-width: 1024px) 25vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-bold">{area.name}</h3>
        <p className="text-sm font-normal">{area.listings} listings</p>
      </div>
    </article>
  );
}

export function AreaGrid({ areas }: AreaGridProps) {
  const [featured, ...rest] = areas;

  return (
    <section className="container mx-auto px-4 pb-12 pt-10 md:pb-16 md:pt-[149px]">
      <h2 className="mb-5 text-2xl font-bold text-neutral-950 md:mb-6 md:text-[28px]">
        Explore Bangkok Areas
      </h2>
      <div className="grid gap-3 lg:flex">
        {featured && (
          <div className="lg:w-[22%] lg:shrink-0">
            <AreaCard area={featured} tall />
          </div>
        )}
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2">
          {rest.map((area) => (
            <AreaCard key={area.name} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}
