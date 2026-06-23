"use client";

import { useEffect, useRef, useState } from "react";
import { form, type SpooshBody } from "@spoosh/core";
import { useQueue, useRead, optimistic } from "@/lib/spoosh";
import type { ClientMediaImage } from "@/types/media";

export type UploadFileItem = {
  id: string;
  filename: string;
  progress: number;
  status: "uploading" | "error";
  errorMessage?: string;
  file: File;
};

interface UseMediaLibraryOptions {
  onUploaded?: (image: ClientMediaImage) => void;
  onStart?: (count: number) => void;
  search?: string;
  page?: number;
  limit?: number;
}

type UploadInput = { id?: string; body: SpooshBody<{ file: File; watermark?: string }> };

function extractErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "error" in error) {
    return String((error as { error: unknown }).error);
  }

  return undefined;
}

export function useMediaLibrary({ onUploaded, onStart, search = "", page = 1, limit = 30 }: UseMediaLibraryOptions = {}) {
  const query: Record<string, string> = { page: String(page), limit: String(limit) };
  if (search) query.search = search;

  const { data, loading } = useRead((api) => api("admin/media").GET({ query }));
  const [fileMeta, setFileMeta] = useState<Record<string, { filename: string; file: File }>>({});
  const processedSuccessRef = useRef<Set<string>>(new Set());

  const { tasks, trigger: queueTrigger, retry, remove, removeSettled } = useQueue(
    (api) => api("admin/media").POST(),
  );
  const trigger = queueTrigger as (input: UploadInput) => ReturnType<typeof queueTrigger>;

  const items: UploadFileItem[] = tasks
    .filter((task) => task.status !== "success" && task.status !== "aborted")
    .map((task) => {
      const meta = fileMeta[task.id];

      return {
        id: task.id,
        filename: meta?.filename ?? "",
        progress: 0,
        status: (task.status === "error" ? "error" : "uploading") as "uploading" | "error",
        errorMessage: task.status === "error" ? extractErrorMessage(task.error) : undefined,
        file: meta?.file ?? new File([], ""),
      };
    });

  useEffect(() => {
    for (const task of tasks) {
      if (task.status === "success" && !processedSuccessRef.current.has(task.id)) {
        processedSuccessRef.current.add(task.id);

        const image = task.data as ClientMediaImage;

        optimistic((cache) =>
          cache("admin/media").set((current) => ({
            ...current,
            images: [image, ...(current?.images ?? [])],
          })),
        );

        onUploaded?.(image);
      }
    }
  }, [tasks, onUploaded]);

  const handleFiles = (files: FileList | null, options?: { watermark?: boolean }) => {
    if (!files?.length) return;

    removeSettled();

    const fileArray = Array.from(files);
    onStart?.(fileArray.length);

    const newMeta: Record<string, { filename: string; file: File }> = {};

    for (const file of fileArray) {
      const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      newMeta[id] = { filename: file.name, file };
      trigger({ id, body: form({ file, watermark: options?.watermark ? "true" : "false" }) });
    }

    setFileMeta((prev) => ({ ...prev, ...newMeta }));
  };

  return {
    images: data?.images ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    loading,
    items,
    handleFiles,
    retry,
    remove,
  };
}
