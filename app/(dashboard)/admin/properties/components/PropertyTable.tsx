"use client";

import { useBulkSelect } from "@/utils/useBulkSelect";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Checkbox, ConfirmDialog, toast } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import type { PropertyListItem } from "@/types/property";
import { getMinPrice } from "@/utils/getMinPrice";
import PropertyStatusBadge from "./PropertyStatusBadge";
import PropertyCard from "./PropertyCard";
import PropertyBulkBar from "./PropertyBulkBar";

const formatPrice = (price: number | null) => {
  if (!price) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(price);
};

interface PropertyTableProps {
  properties: PropertyListItem[];
  onDeleted: () => void;
}

export default function PropertyTable({ properties, onDeleted }: PropertyTableProps) {
  const { trigger: deleteProperty } = useWrite((api) => api("admin/properties/:id").DELETE());
  const { trigger: bulkUpdateProperties } = useWrite((api) => api("admin/properties/bulk").PATCH());
  const { trigger: bulkDeleteProperties } = useWrite((api) => api("admin/properties/bulk").DELETE());

  const { selectedIds, toggleSelect, toggleAll, clearSelection } = useBulkSelect();

  const allSelected = properties.length > 0 && properties.every((p) => selectedIds.has(p.id));

  const handleDelete = (id: string, title: string) => {
    ConfirmDialog.show({
      title: "Delete property?",
      content: `"${title}" will be permanently deleted and cannot be recovered.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        try {
          await deleteProperty({ params: { id } });
          onDeleted();
          toast.success(`"${title}" deleted`);
        } catch {
          toast.error("Failed to delete property");
        }
      },
    });
  };

  const handleBulkPublish = async (isPublished: boolean) => {
    const ids = Array.from(selectedIds);

    try {
      await bulkUpdateProperties({ body: { ids, isPublished } });
      onDeleted();
      clearSelection();
      toast.success(`${ids.length} propert${ids.length > 1 ? "ies" : "y"} ${isPublished ? "published" : "unpublished"}`);
    } catch {
      toast.error("Failed to update properties");
    }
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);

    ConfirmDialog.show({
      title: `Delete ${ids.length} propert${ids.length > 1 ? "ies" : "y"}?`,
      content: `${ids.length} propert${ids.length > 1 ? "ies" : "y"} will be permanently deleted and cannot be recovered.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        try {
          await bulkDeleteProperties({ body: { ids } });
          onDeleted();
          clearSelection();
          toast.success(`${ids.length} propert${ids.length > 1 ? "ies" : "y"} deleted`);
        } catch {
          toast.error("Failed to delete properties");
        }
      },
    });
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-400 text-sm">No properties found. Create your first listing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {selectedIds.size > 0 && (
        <PropertyBulkBar
          selectedCount={selectedIds.size}
          onPublish={() => handleBulkPublish(true)}
          onUnpublish={() => handleBulkPublish(false)}
          onDelete={handleBulkDelete}
          onClear={clearSelection}
        />
      )}

      <div className="md:hidden bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            selected={selectedIds.has(property.id)}
            onToggle={toggleSelect}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="pl-4 pr-0 py-3 w-10">
                <Checkbox checked={allSelected} onChange={() => toggleAll(properties.map((p) => p.id))} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="pl-4 pr-0 py-4 w-10">
                  <Checkbox
                    checked={selectedIds.has(property.id)}
                    onChange={() => toggleSelect(property.id)}
                  />
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-700 transition-colors line-clamp-2"
                  >
                    {property.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {property.propertyType.name}
                </td>
                <td className="px-6 py-4">
                  <PropertyStatusBadge
                    isForSale={property.isForSale}
                    isForRent={property.isForRent}
                    availabilityStatus={property.availabilityStatus}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {formatPrice(getMinPrice(property.pricingTiers))}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${property.isPublished ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                    {property.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id, property.title)}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
