import { z } from "zod";

export const AVAILABILITY_STATUSES = ["AVAILABLE", "SOLD", "RENTED"] as const;

const propertyBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  propertyTypeId: z.string().min(1, "Property type is required"),
  isForSale: z.boolean(),
  isForRent: z.boolean(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
  salePrice: z.coerce.number().positive().nullable().optional(),
  rentPrice: z.coerce.number().positive().nullable().optional(),
  beds: z.coerce.number().int().min(0).nullable().optional(),
  baths: z.coerce.number().int().min(0).nullable().optional(),
  areaSqm: z.coerce.number().positive("Area is required"),
  address: z.string().min(1, "Address is required"),
  provinceId: z.string().min(1, "Province is required"),
  districtId: z.string().nullable().optional(),
  subDistrictId: z.string().nullable().optional(),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  mapImageUrl: z.string().nullable().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  isPetFriendly: z.boolean(),
  imageUrls: z.array(z.string()),
  featureIds: z.array(z.string()),
  transitStations: z.array(
    z.object({
      stationId: z.string().min(1, "Station is required"),
      distanceMeters: z.coerce.number().int().min(1).max(9999),
    }),
  ),
});

export const propertyCreateSchema = propertyBaseSchema.refine(
  (data) => data.isForSale || data.isForRent,
  { message: "At least one of For Sale or For Rent must be selected", path: ["isForSale"] },
);

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;

export const propertyUpdateSchema = propertyBaseSchema.partial().refine(
  (data) => {
    if (data.isForSale !== undefined && data.isForRent !== undefined) {
      return data.isForSale || data.isForRent;
    }
    return true;
  },
  { message: "At least one of For Sale or For Rent must be selected", path: ["isForSale"] },
);

export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;

export const propertyListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  typeId: z.string().optional(),
  status: z.enum(["published", "draft"]).optional(),
  listingType: z.enum(["sale", "rent"]).optional(),
  availability: z.enum(["AVAILABLE", "SOLD", "RENTED"]).optional(),
  provinceId: z.string().optional(),
  districtId: z.string().optional(),
  subDistrictIds: z.string().optional(),
});
