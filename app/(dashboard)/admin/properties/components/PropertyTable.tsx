"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import type { PropertyListItem } from "@/types/property";
import PropertyStatusBadge from "./PropertyStatusBadge";

const formatPrice = (price: number | null) => {
  if (!price) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(price);
};

interface PropertyTableProps {
  properties: PropertyListItem[];
  onDeleted: () => void;
}

export default function PropertyTable({ properties, onDeleted }: PropertyTableProps) {
  const { trigger: deleteProperty } = useWrite((api) => api("admin/properties/:id").DELETE());

  const handleDelete = (id: string, title: string) => {
    ConfirmDialog.show({
      title: "Delete property?",
      content: `"${title}" will be permanently deleted and cannot be recovered.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteProperty({ params: { id } });
        onDeleted();
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{property.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{property.slug}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {property.propertyType.name}
              </td>
              <td className="px-6 py-4">
                <PropertyStatusBadge status={property.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {property.salePrice ? formatPrice(property.salePrice) : null}
                {property.salePrice && property.rentPrice ? " / " : null}
                {property.rentPrice ? `${formatPrice(property.rentPrice)}/mo` : null}
                {!property.salePrice && !property.rentPrice ? "—" : null}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${property.isPublished ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}
                >
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
  );
}
