import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader, WhyExecutiveHomes } from "@/app/components/home";
import { ABOUT_STATS } from "./constants";
import { AboutHero, AboutIntro, AboutStats } from "./components";

export default function AboutPage() {
  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <main className="min-h-screen bg-background text-neutral-950">
        <AboutHero />
        <AboutIntro />
        <AboutStats stats={ABOUT_STATS} />
        <WhyExecutiveHomes />
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
