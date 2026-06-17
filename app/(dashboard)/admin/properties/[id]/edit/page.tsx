"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";
import PropertyForm from "../../components/PropertyForm";

export default function AdminPropertyEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: propertyData, loading: propertyLoading } = useRead((api) =>
    api("admin/properties/:id").GET({ params: { id } }),
  );

  const { data: provincesData, loading: provincesLoading } = useRead((api) =>
    api("admin/provinces").GET(),
  );

  const { trigger: updateProperty } = useWrite((api) =>
    api("admin/properties/:id").PATCH(),
  );

  const handleSubmit = async (values: PropertyCreateInput) => {
    await updateProperty({ params: { id }, body: values });
    router.push("/admin/properties");
  };

  if (propertyLoading || provincesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  const property = propertyData?.property;

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Property not found.</p>
      </div>
    );
  }

  const defaultValues: Partial<PropertyCreateInput> = {
    title: property.title,
    slug: property.slug,
    description: property.description,
    propertyTypeId: property.propertyType.id,
    status: property.status as PropertyCreateInput["status"],
    salePrice: property.salePrice,
    rentPrice: property.rentPrice,
    beds: property.beds,
    baths: property.baths,
    areaSqm: property.areaSqm,
    address: property.address,
    provinceId: property.provinceId,
    districtId: property.districtId,
    subDistrictId: property.subDistrictId,
    lat: property.lat,
    lng: property.lng,
    mapImageUrl: property.mapImageUrl,
    isFeatured: property.isFeatured,
    isPublished: property.isPublished,
    imageUrls: property.images.map((img: { url: string }) => img.url),
    featureIds: property.features.map((f: { id: string }) => f.id),
    transitStations: property.transitStations.map((pt) => ({
      stationId: pt.stationId,
      distanceMeters: pt.distanceMeters,
    })),
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/admin/properties" className="hover:text-gray-700 transition-colors">Properties</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 truncate max-w-xs">{property.title}</span>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <Link
              href={`/properties/${property.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors mt-0.5"
            >
              View property page
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <PropertyForm
        defaultValues={defaultValues}
        provinces={provincesData?.provinces ?? []}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
