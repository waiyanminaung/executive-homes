"use client";

import { FormProvider, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import {
  Button,
  LoadingButton,
  RHFInput,
  RHFInputGroup,
} from "@geckoui/geckoui";
import { DEFAULT_ADMIN_CATEGORY_VALUES } from "@/constants/admin/categories";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Category } from "@/types/content";
import {
  categoryCreateSchema,
  type CategoryCreateInput,
} from "@/validation/categoriesSchema";

interface AdminCategoryModalProps {
  category?: Category;
  orderIndex: number;
  onClose: () => void;
  onSaved: () => void;
}

const labelClassName =
  "text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/40";
const errorClassName = "text-red-400 text-xs font-semibold";

const toFormValues = (
  category: Category | undefined,
  orderIndex: number,
): CategoryCreateInput => {
  if (!category) {
    return {
      ...DEFAULT_ADMIN_CATEGORY_VALUES,
      orderIndex,
    };
  }

  return {
    name: category.name,
    orderIndex: category.orderIndex,
  };
};

export default function AdminCategoryModal({
  category,
  orderIndex,
  onClose,
  onSaved,
}: AdminCategoryModalProps) {
  const methods = useForm<CategoryCreateInput>({
    values: toFormValues(category, orderIndex),
    resolver: zodResolver(
      categoryCreateSchema,
    ) as unknown as Resolver<CategoryCreateInput>,
  });
  const createCategory = useWrite((api) => api("categories").POST());
  const updateCategory = useWrite((api) => api("categories/:id").PUT());
  const isEditing = !!category;
  const loading = createCategory.loading || updateCategory.loading;

  const handleSubmit = methods.handleSubmit(async (values) => {
    const result =
      isEditing && category
        ? await updateCategory.trigger({
            params: { id: category.id },
            body: values,
          })
        : await createCategory.trigger({ body: values });

    if (result.error) {
      methods.setError("name", { message: result.error.message });
      return;
    }

    onSaved();
    onClose();
  });

  return (
    <div
      className={classNames(
        "relative w-full rounded-3xl border border-white/5 bg-[#111] p-8",
        "text-white shadow-2xl lg:rounded-[3rem] lg:p-10",
      )}
    >
      <Button
        type="button"
        variant="icon"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-3 text-white/30 hover:bg-white/5 hover:text-white"
      >
        <X className="size-5" />
      </Button>

      <div className="mb-8">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
          Taxonomy
        </p>
        <h2 className="text-2xl font-black uppercase tracking-tighter lg:text-3xl">
          {isEditing ? "Edit Category" : "Add Category"}
        </h2>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RHFInputGroup
            label="Category Name"
            required
            labelClassName={labelClassName}
            errorClassName={errorClassName}
          >
            <RHFInput
              name="name"
              className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 focus-within:ring-1 focus-within:ring-accent/30"
              inputClassName="font-bold placeholder:text-white/20"
            />
          </RHFInputGroup>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText={isEditing ? "Saving..." : "Creating..."}
            className={classNames(
              "flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4",
              "text-[10px] font-black uppercase tracking-widest text-black transition-all",
              "hover:scale-[1.02] hover:bg-white/90 active:scale-95",
            )}
          >
            <Save className="size-4" />
            Save Category
          </LoadingButton>
        </form>
      </FormProvider>
    </div>
  );
}
