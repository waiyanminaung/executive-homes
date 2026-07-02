import Image from "next/image";
import { ABOUT_INTRO_IMAGE } from "../constants";

const DEFAULT_TAGLINE = "Who We Are";
const DEFAULT_HEADING = "About Us";
const DEFAULT_CONTENT = `
  <p>Executive Homes Bangkok provides its clients with a variety of real estate services including brokering sales, leasing commercial properties, and property management that include renovation, negotiating, tenant improvements and supervision.</p>
  <p>Our Bangkok office is ready to assist you with finding the perfect property for you in the best location of this incredible city. Our experienced staff are available to assist you with all aspects of buying property or land in Bangkok, including property buying laws for foreigners, leases, and contracts.</p>
`;

interface AboutIntroProps {
  tagline?: string;
  heading?: string;
  introContent?: string;
  introImage?: string;
}

export function AboutIntro({ tagline, heading, introContent, introImage }: AboutIntroProps) {
  const resolvedTagline = tagline || DEFAULT_TAGLINE;
  const resolvedHeading = heading || DEFAULT_HEADING;
  const resolvedContent = introContent || DEFAULT_CONTENT;
  const resolvedImage = introImage || ABOUT_INTRO_IMAGE;

  return (
    <section className="px-4 py-8 md:py-[70px]">
      <div className="mx-auto grid w-full max-w-[1186px] gap-6 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div className="grid gap-4 md:gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase md:text-sm">
              {resolvedTagline}
            </p>
            <div className="mt-2 h-px w-10 bg-primary-500 md:mt-3" />
          </div>

          <h2 className="text-2xl font-bold leading-[1.3] text-neutral-900 md:text-[36px] md:leading-[1.4]">
            {resolvedHeading}
          </h2>

          <div
            className="prose max-w-none text-sm leading-[1.6] text-neutral-600 md:prose-lg md:text-base md:leading-[1.7]"
            dangerouslySetInnerHTML={{ __html: resolvedContent }}
          />
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-neutral-200 lg:h-[460px]">
          <Image
            src={resolvedImage}
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
