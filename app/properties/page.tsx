import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import { ListingPage } from "./listing";

export default function PropertiesPage() {
  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <ListingPage />
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
