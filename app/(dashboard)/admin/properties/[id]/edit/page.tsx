"use client";

import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";
import AdminPageHeader from "../../../components/AdminPageHeader";
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
    propertyType: property.propertyType as PropertyCreateInput["propertyType"],
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
    mapImageUrl: property.mapImageUrl,
    isFeatured: property.isFeatured,
    isPublished: property.isPublished,
    imageUrls: property.images.map((img: { url: string }) => img.url),
  };

  return (
    <div>
      <AdminPageHeader title="Edit Property" description={property.title} />
      <PropertyForm
        defaultValues={defaultValues}
        provinces={provincesData?.provinces ?? []}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
