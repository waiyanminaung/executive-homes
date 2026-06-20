import { Spoosh } from "@spoosh/core";
import { create } from "@spoosh/react";
import { cachePlugin } from "@spoosh/plugin-cache";
import { deduplicationPlugin } from "@spoosh/plugin-deduplication";
import { invalidationPlugin } from "@spoosh/plugin-invalidation";
import { optimisticPlugin } from "@spoosh/plugin-optimistic";
import type { ApiSchema } from "@/lib/schema";

const spoosh = new Spoosh<ApiSchema, Error>("/api").use([
  cachePlugin({ staleTime: 30000 }),
  deduplicationPlugin(),
  invalidationPlugin(),
  optimisticPlugin(),
]);

export const { useRead, useWrite, useQueue, optimistic } = create(spoosh);
