"use client";

import { useRead } from "@/lib/spoosh";
import type { AdminReportItem } from "@/types/admin";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminReportsPage() {
  const { data, loading } = useRead((api) => api("reports").GET(), {
    staleTime: 30000,
  });
  const reports = (data ?? []) as AdminReportItem[];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Reports"
        description="Review the latest issue reports sent by viewers and keep the catalog clean."
      />

      {loading ? (
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
          No reports submitted yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-3xl border border-white/5 bg-white/[0.03] p-5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                {report.reason ?? "General"}
              </p>
              <h3 className="mt-3 text-xl font-black uppercase tracking-tighter text-white">
                {report.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/35">
                {report.description}
              </p>
              <p className="mt-6 text-sm text-white/35">
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
