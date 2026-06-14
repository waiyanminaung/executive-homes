import { Suspense } from "react";
import type { Metadata } from "next";
import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import { ListingPage } from "@/components/listing";

export const metadata: Metadata = {
  title: "Properties | Executive Homes",
  description: "Browse all properties for sale and rent in Bangkok.",
  alternates: {
    canonical: "/properties",
  },
};

export default function PropertiesPage() {
  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <Suspense>
        <ListingPage />
      </Suspense>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
