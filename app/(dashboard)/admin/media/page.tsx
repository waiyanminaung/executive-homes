"use client";

import { useState } from "react";
import Image from "next/image";
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
    <div className={classNames("space-y-8")}>
      <AdminPageHeader
        eyebrow="Assets"
        title="Media Library"
        description="Review the live artwork URLs used by the public site and copy them quickly when you need to patch a record."
      />

      <section
        className={classNames(
          "overflow-hidden rounded-3xl border border-white/5 bg-[#111]",
          "shadow-2xl lg:rounded-[2.5rem]",
        )}
      >
        {loading ? (
          <div
            className={classNames(
              "py-20 text-center text-xs font-black uppercase tracking-[0.3em]",
              "text-white/20 animate-pulse",
            )}
          >
            Loading Media...
          </div>
        ) : mediaEntries.length === 0 ? (
          <div
            className={classNames(
              "m-4 rounded-3xl border-2 border-dashed border-white/5 py-20",
              "text-center text-xs font-black uppercase tracking-widest text-white/10",
              "lg:m-8",
            )}
          >
            No Media Found
          </div>
        ) : (
          <div
            className={classNames(
              "grid gap-6 p-4 sm:grid-cols-2 lg:p-8 xl:grid-cols-4",
            )}
          >
            {mediaEntries.map((entry) => (
              <article
                key={entry.id}
                className={classNames(
                  "group overflow-hidden rounded-2xl border border-white/5 bg-[#181818]",
                  "transition-all hover:border-accent/30",
                )}
              >
                <div
                  className={classNames(
                    "aspect-[4/5] overflow-hidden bg-card relative",
                  )}
                >
                  <Image
                    src={entry.url}
                    alt={`${entry.title} ${entry.label}`}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={classNames(
                      "object-cover transition-transform duration-500",
                      "group-hover:scale-110",
                    )}
                  />
                </div>
                <div className={classNames("space-y-4 bg-white/[0.02] p-4")}>
                  <div>
                    <p
                      className={classNames(
                        "text-[10px] font-black uppercase tracking-widest text-white/20",
                      )}
                    >
                      {entry.label}
                    </p>
                    <h3 className="mt-1 truncate text-sm font-bold text-white/60">
                      {entry.title}
                    </h3>
                  </div>
                  <div className={classNames("flex items-center gap-2")}>
                    <Button
                      type="button"
                      variant="outlined"
                      size="sm"
                      onClick={() => copyUrl(entry.url)}
                      className={classNames(
                        "flex-1 justify-center gap-2 rounded-lg border-white/10",
                        "bg-white/10 text-white hover:bg-white/20",
                      )}
                    >
                      <Copy className="size-3" />
                      {copiedUrl === entry.url ? "Copied" : "Link"}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      size="sm"
                      onClick={() =>
                        window.open(entry.url, "_blank", "noopener,noreferrer")
                      }
                      className={classNames(
                        "rounded-lg border-white/10 bg-white/10 text-white",
                        "hover:bg-white/20",
                      )}
                    >
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
