"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { classNames } from "@/utils/classNames";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Building2, exact: false },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare, exact: false },
];

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

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
  };

  const isActive = (href: string, exact: boolean) =>
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
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-700">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none">Executive Homes</p>
              <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={classNames(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-700 text-white text-xs font-bold flex-shrink-0">
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
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
