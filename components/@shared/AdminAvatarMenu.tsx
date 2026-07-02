"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pencil, User } from "lucide-react";
import { classNames } from "@/utils/classNames";
import { authClient } from "@/lib/auth-client";
import { useRead } from "@/lib/spoosh";

function PropertyEditLink({ slug }: { slug: string }) {
  const { data } = useRead((api) => api("properties/:slug").GET({ params: { slug } }));

  if (!data?.property?.id) return null;

  return (
    <Link
      href={`/admin/properties/${data.property.id}/edit`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
    >
      <Pencil className="h-4 w-4 text-gray-400" />
      Edit Property
    </Link>
  );
}

export function AdminAvatarMenu() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user || pathname.startsWith("/admin")) {
    return <div className="h-11 w-11 md:hidden" />;
  }

  const propertySlug = /^\/properties\/([^/]+)$/.exec(pathname)?.[1] ?? null;

  return (
    <div className="relative">
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Admin menu"
        aria-expanded={open}
        className={classNames(
          "flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition-colors md:h-10 md:w-10",
          open && "bg-white/20",
        )}
      >
        <User className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[200px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="truncate text-[11px] text-gray-400">{session.user.email}</p>
          </div>

          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <LayoutDashboard className="h-4 w-4 text-gray-400" />
            Admin Panel
          </Link>

          {propertySlug && <PropertyEditLink slug={propertySlug} />}
        </div>
      )}
    </div>
  );
}
