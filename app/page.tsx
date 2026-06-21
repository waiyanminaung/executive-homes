import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "./constants";
import {
  AreaGrid,
  HomeFooter,
  HomeHeader,
  HomeHero,
  PropertySection,
  WhyExecutiveHomes,
} from "./components/home";
import { getHomeSections } from "@/lib/getHomeSections";
import { getHomeAreaCards } from "@/lib/getHomeAreaCards";

export default async function HomePage() {
  const [sections, areaCards] = await Promise.all([getHomeSections(), getHomeAreaCards()]);

  return (
    <>
      <HomeHeader navItems={HOME_NAV_ITEMS} hideLogo />
      <main className="min-h-screen bg-white">
        <HomeHero />
        <AreaGrid areas={areaCards} />
        {sections.map((section) => (
          <PropertySection key={section.title} section={section} />
        ))}
        <WhyExecutiveHomes />
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
