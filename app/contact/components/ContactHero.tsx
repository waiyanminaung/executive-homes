import Image from "next/image";
import { CONTACT_HERO_BACKGROUND, CONTACT_HERO_PERSON_IMAGE } from "../constants";

export function ContactHero() {
  return (
    <section className="relative flex min-h-[380px] items-end justify-center overflow-hidden md:min-h-[469px] md:items-center">
      <Image
        src={CONTACT_HERO_BACKGROUND}
        alt="Bangkok skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-secondary-950/75" />

      <div className="container relative z-10 mx-auto grid min-h-[380px] items-end px-4 md:min-h-[469px] md:grid-cols-[minmax(0,1fr)_minmax(360px,563px)] md:items-center">
        <div className="relative order-2 mx-auto h-[220px] w-full max-w-[280px] md:order-none md:h-[469px] md:max-w-none">
          <Image
            src={CONTACT_HERO_PERSON_IMAGE}
            alt="Executive Homes support specialist"
            fill
            priority
            sizes="(min-width: 768px) 520px, 60vw"
            className="object-contain object-top"
          />
        </div>

        <div className="order-1 pb-4 pt-6 text-center md:order-none md:pb-0 md:pt-0 md:text-left">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary-400 uppercase md:text-sm">
            Get in Touch
          </p>

          <div className="mt-2 h-px w-10 bg-primary-500 md:mx-0 mx-auto md:mt-3" />

          <h1 className="mt-3 font-sans text-xl font-bold leading-[1.3] text-white md:mt-4 md:text-[40px] md:leading-[1.4]">
            Contact us.
            <br />
            We&apos;d love to hear from you!
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/70 md:mt-4 md:text-base md:leading-7">
            Our Bangkok team is ready to help you find your perfect home.
          </p>
        </div>
      </div>
    </section>
  );
}
