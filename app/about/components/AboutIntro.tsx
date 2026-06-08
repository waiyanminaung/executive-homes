import Image from "next/image";
import { ABOUT_INTRO_IMAGE } from "../constants";

export function AboutIntro() {
  return (
    <section className="px-4 py-12 md:py-[70px]">
      <div className="mx-auto grid w-full max-w-[1186px] gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div className="grid gap-6">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-primary-500 uppercase">
              Who We Are
            </p>
            <div className="mt-3 h-px w-10 bg-primary-500" />
          </div>

          <h2 className="text-[32px] font-bold leading-[1.4] text-neutral-900 md:text-[36px]">
            About Us
          </h2>

          <div className="grid gap-4 text-lg leading-[1.7] text-neutral-600">
            <p>
              Executive Homes Bangkok provides its clients with a variety of real estate services including brokering sales, leasing commercial properties, and property management that include renovation, negotiating, tenant improvements and supervision.
            </p>
            <p>
              Our Bangkok office is ready to assist you with finding the perfect property for you in the best location of this incredible city. Our experienced staff are available to assist you with all aspects of buying property or land in Bangkok, including property buying laws for foreigners, leases, and contracts.
            </p>
          </div>
        </div>

        <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-neutral-200 lg:h-[460px]">
          <Image
            src={ABOUT_INTRO_IMAGE}
            alt="Executive Homes interior"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
