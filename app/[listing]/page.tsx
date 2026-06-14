import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import { ListingPage } from "@/components/listing";
import { parseListingParam } from "@/utils/parseListingParam";

interface PageProps {
  params: Promise<{ listing: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listing } = await params;
  const parsed = parseListingParam(listing);

  if (!parsed) return {};

  const { listingType, propertyTypeLabel } = parsed;
  const action = listingType === "for-rent" ? "Rent" : "Sale";

  return {
    title: `${propertyTypeLabel} for ${action} in Bangkok | Executive Homes`,
    description: `Browse ${propertyTypeLabel.toLowerCase()} for ${action.toLowerCase()} in Bangkok.`,
    alternates: { canonical: `/${listing}` },
  };
}

export default async function ListingTypePage({ params }: PageProps) {
  const { listing } = await params;
  const parsed = parseListingParam(listing);

  if (!parsed) notFound();

  const { listingType, propertyType, propertyTypeLabel } = parsed;
  const action = listingType === "for-rent" ? "Rent" : "Sale";
  const title = `${propertyTypeLabel} for ${action} in Bangkok`;

  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <Suspense>
        <ListingPage listingType={listingType} propertyType={propertyType} pageTitle={title} />
      </Suspense>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
