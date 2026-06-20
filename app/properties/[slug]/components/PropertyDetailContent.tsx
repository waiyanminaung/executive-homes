import { Check, PawPrint } from "lucide-react";
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
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-detail-card md:p-[30px]">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">About this property</h2>
        <div
          className="text-sm leading-relaxed text-neutral-950 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_strong]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: property.description }}
        />
      </div>

      <div className="my-6 h-px bg-gray-300" />

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-950">Unit Features</h2>
        <AmenityGrid amenities={property.unitFeatures} />
      </div>

      <div className="my-6 h-px bg-gray-300" />

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-950">Amenities</h2>
        <AmenitiesGrid amenities={property.commonFacilities} />
      </div>

      {property.isPetFriendly && (
        <>
          <div className="my-6 h-px bg-gray-300" />
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50">
              <PawPrint className="h-6 w-6 text-neutral-600" />
            </span>
            <span className="text-sm leading-[18px] text-neutral-900 font-medium">Pet Friendly</span>
          </div>
        </>
      )}

      <div className="my-6 h-px bg-gray-300" />

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Location</h2>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.548700775188!2d100.60875057534199!3d13.685183886699816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed269181bb1%3A0x60c3178ba983c76!2sTrue%20Digital%20Park!5e0!3m2!1sen!2sth!4v1780917931837!5m2!1sen!2sth"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
