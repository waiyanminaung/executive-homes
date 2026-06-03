import Image from "next/image";
import type { AreaCard } from "@/app/types";

interface AreaGridProps {
  areas: AreaCard[];
}

function AreaCard({ area, tall }: { area: AreaCard; tall?: boolean }) {
  return (
    <article
      className="group relative overflow-hidden rounded-xl shadow-sm"
      style={{ minHeight: tall ? 350 : 169 }}
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
    <section className="container mx-auto px-4 pt-[149px] pb-16">
      <h2 className="mb-6 text-[28px] font-bold text-neutral-950">Explore Bangkok Areas</h2>
      <div className="flex gap-3">
        {featured && (
          <div className="w-[22%] shrink-0">
            <AreaCard area={featured} tall />
          </div>
        )}
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
          {rest.map((area) => (
            <AreaCard key={area.name} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}
