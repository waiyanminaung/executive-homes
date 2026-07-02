import { Check } from "lucide-react";
import type { PropertyAmenity, PropertyDetail } from "../types";

interface PropertyDetailContentProps {
  property: PropertyDetail;
}

function AmenityGrid({ amenities }: { amenities: PropertyAmenity[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {amenities.map((amenity) => (
        <div key={amenity.label} className="flex items-center gap-2.5 rounded-md">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50">
            <amenity.icon className="h-6 w-6 text-neutral-600" />
          </span>
          <span className="text-sm leading-[18px] text-neutral-900">{amenity.label}</span>
        </div>
      ))}
    </div>
  );
}

function AmenitiesGrid({ amenities }: { amenities: PropertyAmenity[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {amenities.map((amenity) => (
        <div key={amenity.label} className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary-500 bg-primary-50">
            <Check className="h-3.5 w-3.5 text-primary-500" strokeWidth={2.5} />
          </span>
          <span className="text-sm leading-[18px] text-neutral-900">{amenity.label}</span>
        </div>
      ))}
    </div>
  );
}

export function PropertyDetailContent({ property }: PropertyDetailContentProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-detail-card md:p-[30px]">
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-base font-bold text-neutral-900 md:text-lg">About this property</h2>
        <div
          className="prose max-w-none text-neutral-950"
          dangerouslySetInnerHTML={{ __html: property.description }}
        />
      </div>

      {property.unitFeatures.length > 0 && (
        <>
          <div className="my-4 h-px bg-gray-300 md:my-6" />
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-base font-bold text-neutral-950 md:text-lg">Unit Features</h2>
            <AmenityGrid amenities={property.unitFeatures} />
          </div>
        </>
      )}

      {property.commonFacilities.length > 0 && (
        <>
          <div className="my-4 h-px bg-gray-300 md:my-6" />
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-base font-bold text-neutral-950 md:text-lg">Amenities</h2>
            <AmenitiesGrid amenities={property.commonFacilities} />
          </div>
        </>
      )}

      {property.lat != null && property.lng != null && (
        <>
          <div className="my-4 h-px bg-gray-300 md:my-6" />
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-base font-bold text-neutral-900 md:text-xl">Location</h2>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <iframe
                src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&z=15&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
