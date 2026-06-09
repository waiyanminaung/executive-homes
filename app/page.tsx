import {
  HOME_AREA_CARDS,
  HOME_FOOTER_COLUMNS,
  HOME_NAV_ITEMS,
  HOME_PROPERTY_SECTIONS,
} from "./constants";
import {
  AreaGrid,
  HomeFooter,
  HomeHeader,
  HomeHero,
  PropertySection,
  WhyExecutiveHomes,
} from "./components/home";

export default function HomePage() {
  return (
    <>
      <HomeHeader navItems={HOME_NAV_ITEMS} hideLogo />
      <main className="min-h-screen bg-white">
        <HomeHero />
        <AreaGrid areas={HOME_AREA_CARDS} />
        {HOME_PROPERTY_SECTIONS.map((section) => (
          <PropertySection key={section.title} section={section} />
        ))}
        <WhyExecutiveHomes />
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
