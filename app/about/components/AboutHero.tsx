import Image from "next/image";
import { ABOUT_HERO_IMAGE } from "../constants";

interface AboutHeroProps {
  heroImage?: string;
}

export function AboutHero({ heroImage }: AboutHeroProps) {
  const src = heroImage || ABOUT_HERO_IMAGE;

  return (
    <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden md:min-h-[478px]">
      <Image
        src={src}
        alt="Bangkok skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-secondary-950/75" />
      <div className="relative flex flex-col items-center px-4 text-center">
        <p className="text-sm font-semibold tracking-[0.18em] text-primary-400 uppercase">
          Welcome to
        </p>
        <div className="mt-3 h-px w-10 bg-primary-500" />
        <h1 className="mt-4 font-sans text-[32px] font-bold leading-[1.35] text-white md:text-[40px] md:leading-[1.5]">
          Executive Homes Bangkok
        </h1>
      </div>
    </section>
  );
}
