"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LayoutDashboard, Pencil } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { useRead } from "@/lib/spoosh";

function PropertyEditLink({ slug }: { slug: string }) {
  const { data } = useRead((api) => api("properties/:slug").GET({ params: { slug } }));

  if (!data?.property?.id) return null;

  return (
    <Link
      href={`/admin/properties/${data.property.id}/edit`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <Pencil className="w-4 h-4 text-gray-400" />
      Edit Property
    </Link>
  );
}

interface AdminFloatingMenuClientProps {
  adminEmail: string;
}

export default function AdminFloatingMenuClient({ adminEmail }: AdminFloatingMenuClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const propertySlug = /^\/properties\/([^/]+)$/.exec(pathname)?.[1] ?? null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {open && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 min-w-[200px] overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-[11px] text-gray-400 truncate">{adminEmail}</p>
            </div>

            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-400" />
              Admin Panel
            </Link>

            {propertySlug && <PropertyEditLink slug={propertySlug} />}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={classNames(
            "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors",
            open ? "bg-primary-700 text-white" : "bg-primary-600 text-white hover:bg-primary-700",
          )}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
