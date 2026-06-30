import { Suspense } from "react";
import { HOME_NAV_ITEMS } from "./constants";
import {
  AreaGrid,
  HomeFooter,
  HomeHeader,
  HomeHero,
  HomeSections,
  WhyExecutiveHomes,
} from "./components/home";
import { getHomeAreaCards } from "@/hono/services/homeAreaCard.service";
import { getAppContent } from "@/hono/services/appContent.service";
import { PropertyCarouselSkeleton } from "@/components/skeletons/PropertyCarouselSkeleton";

export const dynamic = "force-dynamic";

const DEFAULT_AREAS_TITLE = "Explore Bangkok Areas";

export default async function HomePage() {
  const [areaCards, homeContent] = await Promise.all([getHomeAreaCards(), getAppContent("home")]);

  return (
    <>
      <HomeHeader navItems={HOME_NAV_ITEMS} hideLogo />
      <main className="min-h-screen bg-white">
        <HomeHero />
        <AreaGrid areas={areaCards} title={homeContent.areasSectionTitle ?? DEFAULT_AREAS_TITLE} />
        <Suspense fallback={<PropertyCarouselSkeleton />}>
          <HomeSections />
        </Suspense>
        <WhyExecutiveHomes />
      </main>
      <HomeFooter />
    </>
  );
}
