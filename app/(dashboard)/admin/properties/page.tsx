"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import AdminPageHeader from "../components/AdminPageHeader";
import PropertyTable from "./components/PropertyTable";

export default function AdminPropertiesPage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/properties").GET());

  return (
    <div>
      <AdminPageHeader
        title="Properties"
        description="Manage your property listings."
        actions={
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Property
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <PropertyTable
          properties={data?.properties ?? []}
          onDeleted={refetch}
        />
      )}
    </div>
  );
}
