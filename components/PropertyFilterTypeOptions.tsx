"use client";

import { useRead } from "@/lib/spoosh";
import { PropertyFilterOptionButton } from "@/components/PropertyFilterOptionButton";

interface PropertyFilterTypeOptionsProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function PropertyFilterTypeOptions({ value, onChange }: PropertyFilterTypeOptionsProps) {
  const { data } = useRead((api) => api("property-types").GET());
  const propertyTypes = data?.propertyTypes ?? [];

  return (
    <div className="grid grid-cols-2 gap-2">
      {propertyTypes.map((o) => {
        const selected = value === o.slug;
        return (
          <PropertyFilterOptionButton
            key={o.id}
            label={o.name}
            selected={selected}
            hasSelection={!!value}
            onClick={() => onChange(selected ? null : o.slug)}
          />
        );
      })}
    </div>
  );
}
