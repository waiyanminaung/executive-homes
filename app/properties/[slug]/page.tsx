import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, MapPin, Maximize2, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HOME_FOOTER_COLUMNS, HOME_NAV_ITEMS } from "@/app/constants";
import { HomeFooter, InnerPageHeader } from "@/app/components/home";
import {
  PropertyDetailContent,
  PropertyDetailBreadcrumb,
  PropertyDetailGallery,
  PropertyDetailSidebar,
  PropertyDetailSummary,
  SimilarProperties,
} from "./components";
import type { PropertyDetail } from "./types";


interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ listing?: string }>;
}

export default async function PropertyDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { listing } = await searchParams;
  const listingType = listing === "sale" || listing === "rent" ? listing : undefined;

  const raw = await prisma.property.findUnique({
    where: { slug, isPublished: true },
    include: {
      propertyType: true,
      images: { orderBy: { order: "asc" } },
      features: { include: { feature: true } },
      transitStations: { include: { station: true } },
      province: { select: { name: true } },
      district: { select: { name: true } },
      subDistrict: { select: { name: true } },
    },
  });

  if (!raw) notFound();

  const isRent = raw.status === "FOR_RENT";
  const price = isRent ? (raw.rentPrice ?? 0) : (raw.salePrice ?? raw.rentPrice ?? 0);
  const locationLabel = raw.subDistrict?.name ?? raw.district?.name ?? raw.province?.name ?? raw.address;

  const unitFeatures = raw.features
    .filter((pf) => pf.feature.category === "UNIT_FEATURE")
    .map((pf) => ({ label: pf.feature.label, icon: Check }));

  const commonFacilities = raw.features
    .filter((pf) => pf.feature.category === "AMENITY")
    .map((pf) => ({ label: pf.feature.label, icon: Check }));

  const property: PropertyDetail = {
    id: raw.slug,
    title: raw.title,
    location: raw.address,
    price,
    imageUrls: raw.images.map((img) => img.url),
    status: isRent ? "Rent" : "Sale",
    beds: raw.beds ?? 0,
    baths: raw.baths ?? 0,
    area: `${raw.areaSqm} sqm`,
    salePrice: raw.salePrice ?? 0,
    rentPrice: raw.rentPrice ?? 0,
    address: raw.address,
    description: raw.description,
    mapImageUrl: raw.mapImageUrl ?? "",
    detailStats: [
      { label: "Location", value: locationLabel, icon: MapPin },
      { label: "Property Type", value: raw.propertyType.name, icon: Building2 },
      { label: "Property Size", value: `${raw.areaSqm} sqm`, icon: Maximize2 },
      { label: "Bedrooms", value: `${raw.beds ?? 0} bedrooms`, icon: BedDouble },
      { label: "Bathrooms", value: `${raw.baths ?? 0} bathrooms`, icon: Bath },
    ],
    unitFeatures,
    commonFacilities,
  };

  return (
    <>
      <InnerPageHeader navItems={HOME_NAV_ITEMS} />
      <main className="min-h-screen bg-background text-neutral-950">
        <div className="mx-auto w-full max-w-[1292px] px-4 pb-20 md:px-6 xl:px-0">
          <PropertyDetailBreadcrumb title={property.title} />
          <PropertyDetailGallery images={property.imageUrls} title={property.title} />

          <div className="mt-[30px] grid gap-6 lg:grid-cols-[minmax(0,908px)_359px] lg:items-start">
            <div className="grid gap-5">
              <PropertyDetailSummary property={property} listingType={listingType} />
              <PropertyDetailContent property={property} />
            </div>

            <PropertyDetailSidebar />
          </div>

          <div className="mt-[50px]">
            <SimilarProperties />
          </div>
        </div>
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
