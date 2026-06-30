import { HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import { ContactHero, ContactMain } from "./components";

export default function ContactPage() {
  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <main className="min-h-screen bg-background text-neutral-950">
        <ContactHero />
        <ContactMain />
      </main>
      <HomeFooter />
    </>
  );
}
