import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "./constants";
import { HOME_AREA_CARDS } from "./components/home/mock";
import {
  AreaGrid,
  HomeFooter,
  HomeHeader,
  HomeHero,
  PropertySection,
  WhyExecutiveHomes,
} from "./components/home";
import { getHomeSections } from "@/lib/getHomeSections";

export default async function HomePage() {
  const sections = await getHomeSections();

  return (
    <>
      <HomeHeader navItems={HOME_NAV_ITEMS} hideLogo />
      <main className="min-h-screen bg-white">
        <HomeHero />
        <AreaGrid areas={HOME_AREA_CARDS} />
        {sections.map((section) => (
          <PropertySection key={section.title} section={section} />
        ))}
        <WhyExecutiveHomes />
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
