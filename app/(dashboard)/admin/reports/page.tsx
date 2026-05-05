"use client";

import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { AdminReportItem } from "@/types/admin";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminReportsPage() {
  const { data, loading } = useRead((api) => api("reports").GET(), {
    staleTime: 30000,
  });
  const reports = (data ?? []) as AdminReportItem[];

  return (
    <div className={classNames("space-y-8")}>
      <AdminPageHeader
        eyebrow="Moderation"
        title="Quality Reports"
        description="Review the latest issue reports sent by viewers and keep the catalog clean."
      />

      <section
        className={classNames(
          "overflow-hidden rounded-3xl border border-white/5 bg-[#111] p-4",
          "shadow-2xl lg:rounded-[2.5rem] lg:p-8",
        )}
      >
        {loading ? (
          <div
            className={classNames(
              "py-20 text-center text-xs font-black uppercase tracking-[0.3em]",
              "text-white/20 animate-pulse",
            )}
          >
            ဒေတာများကို ရယူနေပါသည်...
          </div>
        ) : reports.length === 0 ? (
          <div
            className={classNames(
              "rounded-3xl border-2 border-dashed border-white/5 py-20 text-center",
              "text-xs font-black uppercase tracking-widest text-white/10",
            )}
          >
            တိုင်ကြားမှု မရှိသေးပါ
          </div>
        ) : (
          <div className={classNames("grid gap-4")}>
            {reports.map((report) => (
              <article
                key={report.id}
                className={classNames(
                  "flex flex-col gap-4 rounded-2xl border border-white/5",
                  "bg-white/5 p-5 transition-all hover:bg-white/[0.07]",
                )}
              >
                <div
                  className={classNames(
                    "flex flex-col justify-between gap-3 sm:flex-row sm:items-start",
                  )}
                >
                  <div>
                    <span
                      className={classNames(
                        "w-fit rounded-full border border-amber-500/20 bg-amber-500/10",
                        "px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                        "text-amber-500",
                      )}
                    >
                      {report.reason ?? "General"}
                    </span>
                    <h3 className="mt-4 text-xl font-bold text-white">
                      {report.title}
                    </h3>
                  </div>
                  <p
                    className={classNames(
                      "text-[10px] font-bold uppercase tracking-widest text-white/20",
                    )}
                  >
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
                <p
                  className={classNames(
                    "rounded-xl border border-white/5 bg-black/40 p-5",
                    "text-sm italic leading-relaxed text-white/70",
                  )}
                >
                  &quot;{report.description}&quot;
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
