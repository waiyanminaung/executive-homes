import type { CategoryCreateInput } from "@/validation/categoriesSchema";

export const CATEGORY_NAME_MAX_LENGTH = 100;

export const DEFAULT_ADMIN_CATEGORY_VALUES: CategoryCreateInput = {
  name: "",
  orderIndex: 0,
};
