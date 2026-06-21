"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Pagination, Spinner } from "@geckoui/geckoui";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useRead } from "@/lib/spoosh";
import AdminPageHeader from "../components/AdminPageHeader";
import PropertyTable from "./components/PropertyTable";
import PropertyFilters from "./components/PropertyFilters";
import type { LocationSelection } from "@/components/@shared/LocationPickerDialog";

const LIMIT = 20;

export default function AdminPropertiesPage() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions({ throttleMs: 400 }));
  const [typeId, setTypeId] = useQueryState("typeId", parseAsString.withDefault(""));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault(""));
  const [listingType, setListingType] = useQueryState("listingType", parseAsString.withDefault(""));
  const [availability, setAvailability] = useQueryState("availability", parseAsString.withDefault(""));
  const [provinceId, setProvinceId] = useQueryState("provinceId", parseAsString.withDefault(""));
  const [districtId, setDistrictId] = useQueryState("districtId", parseAsString.withDefault(""));
  const [subDistrictIds, setSubDistrictIds] = useQueryState("subDistrictIds", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [locationLabel, setLocationLabel] = useState("");

  const { data, loading, trigger: refetch } = useRead((api) =>
    api("admin/properties").GET({
      query: {
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { search } : {}),
        ...(typeId ? { typeId } : {}),
        ...(status ? { status } : {}),
        ...(listingType ? { listingType } : {}),
        ...(availability ? { availability } : {}),
        ...(provinceId ? { provinceId } : {}),
        ...(districtId ? { districtId } : {}),
        ...(subDistrictIds ? { subDistrictIds } : {}),
      },
    }),
  );

  const { data: typesData } = useRead((api) => api("admin/property-types").GET());

  const properties = data?.properties ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const handleLocationChange = (sel: LocationSelection) => {
    setProvinceId(sel.provinceId ?? "");
    setDistrictId(sel.districtId ?? "");
    setSubDistrictIds(sel.subDistrictIds?.join(",") ?? "");
    setPage(1);

    if (!sel.provinceId) {
      setLocationLabel("");
      return;
    }

    let label = sel.provinceName ?? "";
    if (sel.districtName) label += ` › ${sel.districtName}`;
    if (sel.subDistrictIds) label += ` · ${sel.subDistrictIds.length} area${sel.subDistrictIds.length !== 1 ? "s" : ""}`;
    setLocationLabel(label);
  };

  const handleClear = () => {
    setSearch("");
    setTypeId("");
    setStatus("");
    setListingType("");
    setAvailability("");
    setProvinceId("");
    setDistrictId("");
    setSubDistrictIds("");
    setLocationLabel("");
    setPage(1);
  };

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Properties"
        description={total > 0 ? `${total} listing${total !== 1 ? "s" : ""}` : "Manage your property listings."}
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

      <PropertyFilters
        search={search}
        typeId={typeId}
        status={status}
        listingType={listingType}
        availability={availability}
        locationLabel={locationLabel}
        propertyTypes={typesData?.propertyTypes ?? []}
        onSearchChange={handleFilterChange(setSearch)}
        onTypeChange={handleFilterChange(setTypeId)}
        onStatusChange={handleFilterChange(setStatus)}
        onListingTypeChange={handleFilterChange(setListingType)}
        onAvailabilityChange={handleFilterChange(setAvailability)}
        onLocationChange={handleLocationChange}
        onClear={handleClear}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <>
          <PropertyTable properties={properties} onDeleted={refetch} />

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
