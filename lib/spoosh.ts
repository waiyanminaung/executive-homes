import { Spoosh } from "@spoosh/core";
import { create } from "@spoosh/react";
import { cachePlugin } from "@spoosh/plugin-cache";
import { deduplicationPlugin } from "@spoosh/plugin-deduplication";
import { invalidationPlugin } from "@spoosh/plugin-invalidation";
import type { PropertyListItem, PropertyDetail, Province } from "@/types/property";
import type { PropertyCreateInput, PropertyUpdateInput } from "@/validation/propertySchema";

export type ApiSchema = {
  "admin/properties": {
    GET: {
      data: { properties: PropertyListItem[]; total: number; page: number; limit: number };
      query?: { page?: string; limit?: string };
    };
    POST: {
      data: { property: PropertyDetail };
      body: PropertyCreateInput;
    };
  };
  "admin/properties/:id": {
    GET: {
      data: { property: PropertyDetail };
      params: { id: string };
    };
    PATCH: {
      data: { property: PropertyDetail };
      params: { id: string };
      body: PropertyUpdateInput;
    };
    DELETE: {
      data: { ok: true };
      params: { id: string };
    };
  };
  "admin/provinces": {
    GET: {
      data: { provinces: Province[] };
    };
  };
};

const spoosh = new Spoosh<ApiSchema, Error>("/api").use([
  cachePlugin({ staleTime: 30000 }),
  deduplicationPlugin(),
  invalidationPlugin(),
]);

export const { useRead, useWrite } = create(spoosh);
