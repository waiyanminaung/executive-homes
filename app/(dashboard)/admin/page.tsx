"use client";

import Link from "next/link";
import { useRead } from "@/lib/spoosh";
import type { AdminReportItem, AdminRequestItem } from "@/types/admin";
import type { Category, MovieListResponse } from "@/types/content";
import AdminPageHeader from "./components/AdminPageHeader";

const dashboardLinks = [
  {
    href: "/admin/content",
    label: "Content",
    hint: "Browse all movies and series",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    hint: "See how the catalog is grouped",
  },
  {
    href: "/admin/media",
    label: "Media",
    hint: "Inspect poster and backdrop assets",
  },
  {
    href: "/admin/requests",
    label: "Requests",
    hint: "Review viewer requests",
  },
  { href: "/admin/reports", label: "Reports", hint: "Review issue reports" },
];

export default function AdminDashboardPage() {
  const { data: categoriesData } = useRead((api) => api("categories").GET(), {
    staleTime: 60000,
  });
  const { data: moviesData } = useRead((api) =>
    api("movies").GET({
      query: {
        page: 1,
        pageSize: 1,
      },
    }),
  );
  const { data: requestsData } = useRead((api) => api("requests").GET(), {
    staleTime: 30000,
  });
  const { data: reportsData } = useRead((api) => api("reports").GET(), {
    staleTime: 30000,
  });

  const categories = (categoriesData ?? []) as Category[];
  const movies = (moviesData ?? { items: [], total: 0 }) as MovieListResponse;
  const requests = (requestsData ?? []) as AdminRequestItem[];
  const reports = (reportsData ?? []) as AdminReportItem[];

  const stats = [
    { label: "Movies & Series", value: movies.total },
    { label: "Categories", value: categories.length },
    { label: "Requests", value: requests.length },
    { label: "Reports", value: reports.length },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Control Dashboard"
        description="Track the live catalog, keep the taxonomy clean, and jump into the media and moderation sections from one place."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 shadow-2xl shadow-black/10"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
              {stat.label}
            </p>
            <p className="mt-4 text-4xl font-black tracking-tighter text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 lg:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
            Quick Actions
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tighter">
            Jump between sections
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {dashboardLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/5 bg-[#111] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04]"
              >
                <p className="text-sm font-black uppercase tracking-widest text-white">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-white/45 leading-relaxed">
                  {item.hint}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 lg:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
            Latest State
          </p>
          <div className="mt-5 space-y-3">
            {[
              { label: "Current catalog total", value: movies.total },
              { label: "Categories available", value: categories.length },
              { label: "Newest requests", value: requests.length },
              { label: "Newest reports", value: reports.length },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
              >
                <span className="text-sm text-white/45">{item.label}</span>
                <span className="text-sm font-black text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
              Recent Catalog
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tighter">
              Latest items from the library
            </h2>
          </div>
          <Link
            href="/admin/content"
            className="text-sm font-bold text-accent hover:underline"
          >
            Open content
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {movies.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/30 md:col-span-2 xl:col-span-3">
              No catalog items yet.
            </div>
          ) : (
            movies.items.map((movie) => (
              <div
                key={movie.id}
                className="rounded-2xl border border-white/5 bg-[#111] overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-black/30">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">
                        {movie.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/40">
                        {movie.genre.join(" · ")}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/50">
                      {movie.type}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-white/45">
                    <span>{movie.year}</span>
                    <span>Rating {movie.rating}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
