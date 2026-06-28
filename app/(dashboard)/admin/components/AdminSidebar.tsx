"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  X,
  MapPin,
  Train,
  ChevronDown,
  Tag,
  Layers,
  Images,
  FileText,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { classNames } from "@/utils/classNames";
import { USER_ROLES } from "@/constants/auth";

const getInitials = (name?: string | null) => {
  if (!name?.trim()) return "AD";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session.data?.user;

  const propertiesSubPaths = [
    "/admin/properties",
    "/admin/property-types",
    "/admin/features",
    "/admin/locations",
    "/admin/transit-stations",
  ];
  const propertiesExpanded = propertiesSubPaths.some((p) => pathname.startsWith(p));
  const [propertiesOpen, setPropertiesOpen] = useState(propertiesExpanded);

  const pagesSubPaths = ["/admin/pages/home", "/admin/pages/contact"];
  const pagesExpanded = pagesSubPaths.some((p) => pathname.startsWith(p));
  const [pagesOpen, setPagesOpen] = useState(pagesExpanded);

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {open !== undefined && (
        <div
          className={classNames(
            "fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity",
            open ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={onClose}
        />
      )}

      <aside
        className={classNames(
          "fixed top-0 left-0 h-full w-64 bg-gray-900 flex flex-col z-30",
          "transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          open === false ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-700">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none">Executive Homes</p>
              <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <Link
            href="/admin"
            onClick={onClose}
            className={classNames(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/admin", true) ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </Link>

          <Link
            href="/admin/library"
            onClick={onClose}
            className={classNames(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/admin/library") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <Images className="w-4 h-4 shrink-0" />
            Library
          </Link>

          <div>
            <button
              onClick={() => setPropertiesOpen((prev) => !prev)}
              className={classNames(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                propertiesSubPaths.some((p) => pathname.startsWith(p))
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Properties</span>
              <ChevronDown
                className={classNames(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  propertiesOpen ? "rotate-180" : "",
                )}
              />
            </button>

            {propertiesOpen && (
              <div className="mt-0.5 ml-3 pl-4 border-l border-white/10 space-y-0.5">
                <Link
                  href="/admin/properties"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith("/admin/properties") && !pathname.startsWith("/admin/property-types")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  All Properties
                </Link>

                <Link
                  href="/admin/property-types"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive("/admin/property-types")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  Property Types
                </Link>

                <Link
                  href="/admin/features"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive("/admin/features")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Tag className="w-3.5 h-3.5 shrink-0" />
                  Features
                </Link>

                <Link
                  href="/admin/locations"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive("/admin/locations")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  Locations
                </Link>

                <Link
                  href="/admin/transit-stations"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive("/admin/transit-stations")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Train className="w-3.5 h-3.5 shrink-0" />
                  Transit Stations
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setPagesOpen((prev) => !prev)}
              className={classNames(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                pagesSubPaths.some((p) => pathname.startsWith(p))
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Pages</span>
              <ChevronDown
                className={classNames(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  pagesOpen ? "rotate-180" : "",
                )}
              />
            </button>

            {pagesOpen && (
              <div className="mt-0.5 ml-3 pl-4 border-l border-white/10 space-y-0.5">
                <Link
                  href="/admin/pages/home"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive("/admin/pages/home")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  Home
                </Link>

                <Link
                  href="/admin/pages/contact"
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive("/admin/pages/contact")
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  Contact
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/admin/enquiries"
            onClick={onClose}
            className={classNames(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/admin/enquiries") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            Enquiries
          </Link>

          {user?.role === USER_ROLES.SUPERADMIN && (
            <Link
              href="/admin/users"
              onClick={onClose}
              className={classNames(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive("/admin/users") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Users className="w-4 h-4 shrink-0" />
              Users
            </Link>
          )}

        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-700 text-white text-xs font-bold shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name ?? "Admin"}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
