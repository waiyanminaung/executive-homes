"use client";

import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { MovieListResponse } from "@/types/content";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminMediaPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { data: moviesData, loading } = useRead((api) =>
    api("movies").GET({
      query: { page: 1, pageSize: 100 },
    }),
  );

  const movies = (moviesData ?? { items: [], total: 0 }) as MovieListResponse;

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    window.setTimeout(() => setCopiedUrl(null), 1500);
  };

  const mediaEntries = movies.items.flatMap((item) => [
    {
      id: `${item.id}-poster`,
      title: item.title,
      label: "Poster",
      url: item.posterUrl,
    },
    {
      id: `${item.id}-backdrop`,
      title: item.title,
      label: "Backdrop",
      url: item.backdropUrl,
    },
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Assets"
        title="Media Library"
        description="Review the live artwork URLs used by the public site and copy them quickly when you need to patch a record."
      />

      {loading ? (
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
          Loading media assets...
        </div>
      ) : mediaEntries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
          No media assets found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mediaEntries.map((entry) => (
            <article
              key={entry.id}
              className="overflow-hidden rounded-3xl border border-white/5 bg-[#111] shadow-2xl shadow-black/10"
            >
              <div className="aspect-[16/10] overflow-hidden bg-black/20">
                <img
                  src={entry.url}
                  alt={`${entry.title} ${entry.label}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                    {entry.label}
                  </p>
                  <h3 className="mt-2 text-xl font-black uppercase tracking-tighter text-white">
                    {entry.title}
                  </h3>
                </div>
                <p className="break-all rounded-2xl bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/45">
                  {entry.url}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outlined"
                    size="sm"
                    onClick={() => copyUrl(entry.url)}
                    className={classNames(
                      "flex-1 justify-center gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10",
                    )}
                  >
                    <Copy className="size-4" />
                    {copiedUrl === entry.url ? "Copied" : "Copy URL"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    size="sm"
                    onClick={() =>
                      window.open(entry.url, "_blank", "noopener,noreferrer")
                    }
                    className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
