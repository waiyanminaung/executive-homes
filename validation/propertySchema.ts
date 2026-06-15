import { z } from "zod";

export const PROPERTY_TYPES = [
  "CONDO",
  "APARTMENT",
  "HOUSE",
  "VILLA",
  "TOWNHOUSE",
  "PENTHOUSE",
  "OFFICE_SPACE",
  "RETAIL_SPACE",
  "COMMERCIAL_SPACE",
  "WAREHOUSE",
] as const;

export const LISTING_STATUSES = [
  "FOR_SALE",
  "FOR_RENT",
  "FOR_SALE_AND_RENT",
  "SOLD",
  "RENTED",
  "OFF_MARKET",
] as const;

export const propertyCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  propertyType: z.enum(PROPERTY_TYPES),
  status: z.enum(LISTING_STATUSES),
  salePrice: z.coerce.number().positive().nullable().optional(),
  rentPrice: z.coerce.number().positive().nullable().optional(),
  beds: z.coerce.number().int().min(0).nullable().optional(),
  baths: z.coerce.number().int().min(0).nullable().optional(),
  areaSqm: z.coerce.number().positive("Area is required"),
  address: z.string().min(1, "Address is required"),
  provinceId: z.string().min(1, "Province is required"),
  districtId: z.string().nullable().optional(),
  subDistrictId: z.string().nullable().optional(),
  mapImageUrl: z.string().nullable().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  imageUrls: z.array(z.string()),
  featureIds: z.array(z.string()),
  transitStations: z.array(
    z.object({
      stationId: z.string().min(1, "Station is required"),
      distanceMeters: z.coerce.number().int().min(1).max(9999),
    }),
  ),
});

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;

export const propertyUpdateSchema = propertyCreateSchema.partial();

export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;

export const propertyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
