import { HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader, WhyExecutiveHomes } from "@/app/components/home";
import { getAppContent } from "@/hono/services/appContent.service";
import { ABOUT_STATS } from "./constants";
import { AboutHero, AboutIntro, AboutStats } from "./components";
import type { AboutStat } from "./types";

export default async function AboutPage() {
  const content = await getAppContent("about");

  let stats: AboutStat[] = ABOUT_STATS;

  if (content.stats) {
    try {
      const parsed = JSON.parse(content.stats) as AboutStat[];
      if (Array.isArray(parsed) && parsed.length > 0) stats = parsed;
    } catch {
      // fallback to default
    }
  }

  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <main className="min-h-screen bg-background text-neutral-950">
        <AboutHero heroImage={content.heroImage} />
        <AboutIntro
          tagline={content.introTagline}
          heading={content.introHeading}
          introContent={content.introContent}
          introImage={content.introImage}
        />
        <AboutStats stats={stats} />
        <WhyExecutiveHomes />
      </main>
      <HomeFooter />
    </>
  );
}
