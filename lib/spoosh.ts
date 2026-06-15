import { Spoosh } from "@spoosh/core";
import { create } from "@spoosh/react";
import { cachePlugin } from "@spoosh/plugin-cache";
import { deduplicationPlugin } from "@spoosh/plugin-deduplication";
import { invalidationPlugin } from "@spoosh/plugin-invalidation";
import type { PropertyListItem, PropertyDetail, Province } from "@/types/property";
import type { Feature } from "@/types/feature";
import type { TransitStation } from "@/types/transitStation";
import type { District } from "@/types/location";
import type { PropertyCreateInput, PropertyUpdateInput } from "@/validation/propertySchema";
import type { FeatureCreateInput, FeatureUpdateInput } from "@/validation/featureSchema";
import type { ProvinceCreateInput, ProvinceUpdateInput, DistrictCreateInput, DistrictUpdateInput } from "@/validation/locationSchema";
import type { PublicEnquiryInput } from "@/validation/publicEnquirySchema";

interface EnquiryListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  listingType: string | null;
  isRead: boolean;
  createdAt: string;
  property: { id: string; title: string; slug: string } | null;
}

interface PublicPropertyListItem extends PropertyListItem {
  address: string;
  images: { url: string }[];
}

export type ApiSchema = {
  "admin/properties": {
    GET: { data: { properties: PropertyListItem[]; total: number; page: number; limit: number }; query?: { page?: string; limit?: string } };
    POST: { data: { property: PropertyDetail }; body: PropertyCreateInput };
  };
  "admin/properties/:id": {
    GET: { data: { property: PropertyDetail }; params: { id: string } };
    PATCH: { data: { property: PropertyDetail }; params: { id: string }; body: PropertyUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
  "admin/provinces": {
    GET: { data: { provinces: Province[] } };
  };
  "admin/features": {
    GET: { data: { features: Feature[] } };
    POST: { data: { feature: Feature }; body: FeatureCreateInput };
  };
  "admin/features/:id": {
    PATCH: { data: { feature: Feature }; params: { id: string }; body: FeatureUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
  "admin/transit-stations": {
    GET: { data: { stations: TransitStation[] } };
  };
  "admin/locations/provinces": {
    GET: { data: { provinces: Province[] } };
    POST: { data: { province: Province }; body: ProvinceCreateInput };
  };
  "admin/locations/provinces/:id": {
    PATCH: { data: { province: Province }; params: { id: string }; body: ProvinceUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
  "admin/locations/districts": {
    GET: { data: { districts: (District & { province: { id: string; name: string } })[] }; query?: { provinceId?: string } };
    POST: { data: { district: District & { province: { id: string; name: string } } }; body: DistrictCreateInput };
  };
  "admin/locations/districts/:id": {
    PATCH: { data: { district: District & { province: { id: string; name: string } } }; params: { id: string }; body: DistrictUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
  "admin/enquiries": {
    GET: { data: { enquiries: EnquiryListItem[]; total: number; page: number; limit: number }; query?: { page?: string; limit?: string; isRead?: string } };
  };
  "admin/enquiries/:id/read": {
    PATCH: { data: { enquiry: EnquiryListItem }; params: { id: string } };
  };
  "admin/enquiries/:id": {
    DELETE: { data: { ok: true }; params: { id: string } };
  };
  "properties": {
    GET: {
      data: { properties: PublicPropertyListItem[]; total: number; page: number; limit: number };
      query?: { page?: string; limit?: string; status?: string; type?: string; provinceId?: string; beds?: string; q?: string; sort?: string };
    };
  };
  "properties/:slug": {
    GET: { data: { property: PropertyDetail }; params: { slug: string } };
  };
  "enquiries": {
    POST: { data: { ok: true }; body: PublicEnquiryInput };
  };
};

const spoosh = new Spoosh<ApiSchema, Error>("/api").use([
  cachePlugin({ staleTime: 30000 }),
  deduplicationPlugin(),
  invalidationPlugin(),
]);

export const { useRead, useWrite } = create(spoosh);
