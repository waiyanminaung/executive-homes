"use client";

import { useRead } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import type { AdminRequestItem } from "@/types/admin";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminRequestsPage() {
  const { data, loading } = useRead((api) => api("requests").GET(), {
    staleTime: 30000,
  });
  const requests = (data ?? []) as AdminRequestItem[];

  return (
    <div className={classNames("space-y-8")}>
      <AdminPageHeader
        eyebrow="Moderation"
        title="Content Requests"
        description="See the latest viewer requests that were submitted through the public site."
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
        ) : requests.length === 0 ? (
          <div
            className={classNames(
              "rounded-3xl border-2 border-dashed border-white/5 py-20 text-center",
              "text-xs font-black uppercase tracking-widest text-white/10",
            )}
          >
            တောင်းဆိုမှု မရှိသေးပါ
          </div>
        ) : (
          <div className={classNames("grid gap-4")}>
            {requests.map((request) => (
              <article
                key={request.id}
                className={classNames(
                  "flex flex-col justify-between gap-3 rounded-2xl border",
                  "border-white/5 bg-white/5 p-5 transition-all hover:bg-white/[0.07]",
                  "sm:flex-row sm:items-center",
                )}
              >
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {request.title}
                  </h3>
                  <p
                    className={classNames(
                      "mt-1 text-[10px] font-bold uppercase tracking-widest",
                      "text-white/30",
                    )}
                  >
                    Requested at {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={classNames(
                    "w-fit rounded-full bg-[#24A1DE]/10 px-3 py-1",
                    "text-[10px] font-black uppercase tracking-widest text-[#24A1DE]",
                  )}
                >
                  Request
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
