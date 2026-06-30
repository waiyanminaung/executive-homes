import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import { ListingPage } from "@/components/listing";
import { parseListingParam } from "@/utils/parseListingParam";
import { capitalize } from "@/utils/capitalize";

interface PageProps {
  params: Promise<{ listing: string; location: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listing, location } = await params;
  const parsed = parseListingParam(listing);

  if (!parsed) return {};

  const { listingType, propertyTypeLabel } = parsed;
  const action = listingType === "for-rent" ? "Rent" : "Sale";
  const locationLabel = location.map(capitalize).join(", ");

  return {
    title: `${propertyTypeLabel} for ${action} in ${locationLabel} | Executive Homes`,
    description: `Browse ${propertyTypeLabel.toLowerCase()} for ${action.toLowerCase()} in ${locationLabel}.`,
    alternates: { canonical: `/${listing}/${location.join("/")}` },
  };
}

export default async function ListingTypeLocationPage({ params }: PageProps) {
  const { listing, location } = await params;
  const parsed = parseListingParam(listing);

  if (!parsed) notFound();

  const { listingType, propertyType, propertyTypeLabel } = parsed;
  const action = listingType === "for-rent" ? "Rent" : "Sale";
  const locationLabel = location.map(capitalize).join(", ");
  const title = `${propertyTypeLabel} for ${action} in ${locationLabel}`;
  const [, district] = location;

  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <Suspense>
        <ListingPage
          listingType={listingType}
          propertyType={propertyType}
          defaultLocation={district}
          pageTitle={title}
        />
      </Suspense>
      <HomeFooter />
    </>
  );
}
