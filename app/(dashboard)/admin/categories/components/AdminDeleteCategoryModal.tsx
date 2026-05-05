"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button, LoadingButton, Select, SelectOption } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Category } from "@/types/content";

interface AdminDeleteCategoryModalProps {
  categories: Category[];
  category: Category;
  onClose: () => void;
  onDeleted: () => void;
}

export default function AdminDeleteCategoryModal({
  categories,
  category,
  onClose,
  onDeleted,
}: AdminDeleteCategoryModalProps) {
  const [replacementCategoryId, setReplacementCategoryId] = useState<
    string | null
  >(null);
  const deleteCategory = useWrite((api) => api("categories/:id").DELETE());
  const availableCategories = categories.filter((item) => item.id !== category.id);

  const handleDelete = async () => {
    const result = await deleteCategory.trigger({
      params: { id: category.id },
      body: { replacementCategoryId },
    });

    if (result.error) return;

    onDeleted();
    onClose();
  };

  return (
    <div
      className={classNames(
        "w-full rounded-[2rem] border border-white/5 bg-[#111] p-8 text-white",
        "shadow-2xl lg:rounded-[3rem] lg:p-10",
      )}
    >
      <div className="mb-4 flex items-center gap-4 text-red-500">
        <AlertTriangle className="size-7" />
        <h2 className="text-xl font-black uppercase tracking-tighter text-white lg:text-2xl">
          Delete Category
        </h2>
      </div>
      <p className="mb-8 text-sm leading-relaxed text-white/50">
        &quot;{category.name}&quot; ကို ဖျက်လိုက်ရင် အထဲမှာရှိတဲ့
        ရုပ်ရှင်တွေကို ဘာလုပ်မလဲ?
      </p>

      <div className="mb-10 space-y-4">
        <Button
          type="button"
          onClick={() => setReplacementCategoryId(null)}
          className={classNames(
            "flex w-full items-center justify-between rounded-2xl border p-4 text-left",
            "transition-all",
            replacementCategoryId === null
              ? "border-accent bg-accent/10 text-accent"
              : "border-white/5 bg-white/5 text-white/40",
          )}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">
            Category မရှိဘဲ ထားမည်
          </span>
          {replacementCategoryId === null ? <CheckCircle2 className="size-4" /> : null}
        </Button>

        {availableCategories.length ? (
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/20">
              တခြား Category သို့ ပြောင်းမည်
            </label>
            <Select
              value={replacementCategoryId ?? ""}
              onChange={(value) => setReplacementCategoryId(value)}
              className="rounded-2xl border-white/5 bg-white/5"
            >
              <SelectOption value="" label="ရွေးချယ်ပါ..." />
              {availableCategories.map((item) => (
                <SelectOption key={item.id} value={item.id} label={item.name} />
              ))}
            </Select>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="order-2 rounded-xl py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 sm:order-1 sm:flex-1"
        >
          မဖျက်တော့ပါ
        </Button>
        <LoadingButton
          type="button"
          loading={deleteCategory.loading}
          loadingText="Deleting..."
          onClick={handleDelete}
          className="order-1 rounded-xl bg-red-500 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-600 sm:order-2 sm:flex-1"
        >
          ဒေတာဖျက်မည်
        </LoadingButton>
      </div>
    </div>
  );
}
