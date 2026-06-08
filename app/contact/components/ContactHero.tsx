import Image from "next/image";
import { CONTACT_HERO_BACKGROUND, CONTACT_HERO_PERSON_IMAGE } from "../constants";

export function ContactHero() {
  return (
    <section className="relative flex min-h-[420px] items-end justify-center overflow-hidden md:min-h-[469px] md:items-center">
      <Image
        src={CONTACT_HERO_BACKGROUND}
        alt="Bangkok skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-secondary-950/75" />

      <div className="container relative z-10 mx-auto grid min-h-[420px] items-end px-4 md:min-h-[469px] md:grid-cols-[minmax(0,1fr)_minmax(360px,563px)] md:items-center">
        <div className="relative mx-auto h-[330px] w-full max-w-[430px] md:h-[469px] md:max-w-none">
          <Image
            src={CONTACT_HERO_PERSON_IMAGE}
            alt="Executive Homes support specialist"
            fill
            priority
            sizes="(min-width: 768px) 520px, 90vw"
            className="object-contain object-top"
          />
        </div>

        <div className="pb-10 text-center md:pb-0 md:text-left">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary-400 uppercase">
            Get in Touch
          </p>

          <div className="mt-3 h-px w-10 bg-primary-500 md:mx-0 mx-auto" />

          <h1 className="mt-4 font-sans text-[30px] font-bold leading-[1.35] text-white md:text-[40px] md:leading-[1.4]">
            Contact us.
            <br />
            We&apos;d love to hear from you!
          </h1>

          <p className="mt-4 text-base leading-7 text-white/70">
            Our Bangkok team is ready to help you find your perfect home.
          </p>
        </div>
      </div>
    </section>
  );
}
