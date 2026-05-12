"use client";

import { AlertTriangle } from "lucide-react";
import { Button, LoadingButton } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { Content } from "@/types/content";

interface AdminDeleteContentModalProps {
  content: Content;
  onClose: () => void;
  onDeleted: () => void;
}

export default function AdminDeleteContentModal({
  content,
  onClose,
  onDeleted,
}: AdminDeleteContentModalProps) {
  const deleteContent = useWrite((api) => api("movies/:id").DELETE());

  const handleDelete = async () => {
    const result = await deleteContent.trigger({
      params: { id: content.id },
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
          Delete Content
        </h2>
      </div>
      <p className="mb-8 text-sm leading-relaxed text-white/50">
        &quot;{content.title}&quot; ကို ဖျက်လိုက်မယ်ဆိုရင် ပြန်မရနိုင်ပါ။
      </p>

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
          loading={deleteContent.loading}
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
