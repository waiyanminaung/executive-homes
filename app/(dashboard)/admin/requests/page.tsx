"use client";

import { useRead } from "@/lib/spoosh";
import type { AdminRequestItem } from "@/types/admin";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminRequestsPage() {
  const { data, loading } = useRead((api) => api("requests").GET(), {
    staleTime: 30000,
  });
  const requests = (data ?? []) as AdminRequestItem[];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Requests"
        description="See the latest viewer requests that were submitted through the public site."
      />

      {loading ? (
        <div className="rounded-3xl border border-white/5 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-12 text-center text-sm text-white/30">
          No requests submitted yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-3xl border border-white/5 bg-white/[0.03] p-5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                Request
              </p>
              <h3 className="mt-3 text-xl font-black uppercase tracking-tighter text-white">
                {request.title}
              </h3>
              <p className="mt-6 text-sm text-white/35">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
