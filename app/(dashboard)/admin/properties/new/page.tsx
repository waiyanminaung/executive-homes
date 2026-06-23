"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Spinner, toast } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import type { PropertyCreateInput } from "@/validation/propertySchema";
import PropertyForm from "../components/PropertyForm";

export default function AdminPropertyNewPage() {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { data: provincesData, loading } = useRead((api) => api("admin/provinces").GET());
  const { trigger: createProperty } = useWrite((api) => api("admin/properties").POST());

  const handleSubmit = async (values: PropertyCreateInput) => {
    try {
      const result = await createProperty({ body: values });

      if (result.error || !result.data?.property.id) {
        toast.error("Failed to create property");
        return;
      }

      toast.success("Property created successfully");
      router.push(`/admin/properties/${result.data.property.id}/edit`);
    } catch {
      toast.error("Failed to create property");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/admin/properties" className="hover:text-gray-700 transition-colors">Properties</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{title || "New Property"}</span>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title || "New Property"}</h1>
          </div>
        </div>
      </div>

      <PropertyForm
        provinces={provincesData?.provinces ?? []}
        onSubmit={handleSubmit}
        submitLabel="Create Property"
        onTitleChange={setTitle}
      />
    </div>
  );
}
