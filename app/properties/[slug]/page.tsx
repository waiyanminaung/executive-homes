import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, MapPin, Maximize2, PawPrint } from "lucide-react";
import { getLucideIcon } from "@/utils/getLucideIcon";
import { haversineMeters } from "@/utils/haversine";
import { getPropertyBySlug, getSimilarProperties } from "@/hono/services/propertyDetail.service";
import { getContactInfo } from "@/hono/services/contactInfo.service";
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
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const raw = await getPropertyBySlug(slug);

  if (!raw) notFound();

  const [similarProperties, contactInfo] = await Promise.all([
    getSimilarProperties(slug, raw.provinceId, raw.propertyTypeId),
    getContactInfo(),
  ]);

  const price = raw.isForSale ? (raw.salePrice ?? 0) : (raw.rentPrice ?? 0);
  const listingType = raw.isForSale && raw.isForRent ? "Sale & Rent" : raw.isForSale ? "Sale" : "Rent";
  const locationLabel = raw.subDistrict?.name ?? raw.district?.name ?? raw.province?.name ?? raw.address;

  const unitFeatures = raw.features
    .filter((pf) => pf.feature.category === "UNIT_FEATURE")
    .map((pf) => ({ label: pf.feature.label, icon: getLucideIcon(pf.feature.icon) }));

  const commonFacilities = raw.features
    .filter((pf) => pf.feature.category === "AMENITY")
    .map((pf) => ({ label: pf.feature.label, icon: getLucideIcon(pf.feature.icon) }));

  const transitStations = raw.transitStations.map((pt) => {
    const hasCoords =
      raw.lat != null &&
      raw.lng != null &&
      pt.station.lat != null &&
      pt.station.lng != null;

    const calculatedMeters = hasCoords
      ? haversineMeters(raw.lat!, raw.lng!, pt.station.lat!, pt.station.lng!)
      : null;

    const googleMapsUrl = hasCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${raw.lat},${raw.lng}&destination=${pt.station.lat},${pt.station.lng}&travelmode=walking`
      : null;

    return {
      stationId: pt.stationId,
      code: pt.station.code ?? null,
      name: pt.station.name,
      line: pt.station.line,
      calculatedMeters,
      googleMapsUrl,
    };
  });

  const property: PropertyDetail = {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    location: raw.address,
    price,
    imageUrls: raw.images.map((img) => img.url),
    listingType,
    availabilityStatus: raw.availabilityStatus,
    isForSale: raw.isForSale,
    isForRent: raw.isForRent,
    beds: raw.beds ?? 0,
    baths: raw.baths ?? 0,
    area: `${raw.areaSqm} sqm`,
    salePrice: raw.salePrice ?? 0,
    rentPrice: raw.rentPrice ?? 0,
    address: raw.address,
    provinceName: raw.province?.name ?? null,
    districtName: raw.district?.name ?? null,
    subDistrictName: raw.subDistrict?.name ?? null,
    description: raw.description,
    mapImageUrl: raw.mapImageUrl ?? "",
    isPetFriendly: raw.isPetFriendly,
    detailStats: [
      { label: "Location", value: locationLabel, icon: MapPin },
      { label: "Property Type", value: raw.propertyType.name, icon: Building2 },
      { label: "Property Size", value: `${raw.areaSqm} sqm`, icon: Maximize2 },
      { label: "Bedrooms", value: `${raw.beds ?? 0} bedrooms`, icon: BedDouble },
      { label: "Bathrooms", value: `${raw.baths ?? 0} bathrooms`, icon: Bath },
      ...(raw.isPetFriendly ? [{ label: "Pet Friendly", value: "Yes", icon: PawPrint }] : []),
    ],
    unitFeatures,
    commonFacilities,
    transitStations,
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
              <PropertyDetailSummary property={property} />
              <PropertyDetailContent property={property} />
            </div>

            <PropertyDetailSidebar contactInfo={contactInfo} />
          </div>

          <div className="mt-[50px]">
            <SimilarProperties properties={similarProperties} />
          </div>
        </div>
      </main>
      <HomeFooter columns={HOME_FOOTER_COLUMNS} />
    </>
  );
}
