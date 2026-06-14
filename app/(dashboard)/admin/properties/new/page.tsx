"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";
import AdminPageHeader from "../../components/AdminPageHeader";
import PropertyForm from "../components/PropertyForm";

export default function AdminPropertyNewPage() {
  const router = useRouter();
  const { data: provincesData, loading } = useRead((api) => api("admin/provinces").GET());
  const { trigger: createProperty } = useWrite((api) => api("admin/properties").POST());

  const handleSubmit = async (values: PropertyCreateInput) => {
    await createProperty({ body: values });
    router.push("/admin/properties");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="New Property"
        description="Create a new property listing."
      />
      <PropertyForm
        provinces={provincesData?.provinces ?? []}
        onSubmit={handleSubmit}
        submitLabel="Create Property"
      />
    </div>
  );
}
