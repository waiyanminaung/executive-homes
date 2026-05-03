"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Film,
  Grid2x2,
  Images,
  LayoutDashboard,
  MessageSquareWarning,
  ShieldAlert,
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";
import { Button, Menu, MenuItem, MenuTrigger } from "@geckoui/geckoui";
import { authClient } from "@/lib/auth-client";
import { classNames } from "@/utils/classNames";

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: Film },
  { href: "/admin/categories", label: "Categories", icon: Grid2x2 },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/requests", label: "Requests", icon: MessageSquareWarning },
  { href: "/admin/reports", label: "Reports", icon: ShieldAlert },
];

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session.data?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
  };

  const currentLabel =
    navItems.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:flex border-r border-white/5 bg-[#0D0D0D]/90 backdrop-blur-xl">
          <div className="flex w-full flex-col gap-8 p-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/25">
                Patekar Admin
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Control Room
              </h2>
              <p className="text-xs text-white/35 leading-relaxed">
                Manage content, categories, media assets and community feedback
                in one place.
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                      active
                        ? "bg-white text-black shadow-lg shadow-white/10"
                        : "bg-white/0 text-white/45 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-3xl border border-white/5 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                Signed in as
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-xs text-white/35 break-all">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-white/70 lg:hidden">
                  <MenuIcon className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25">
                    Admin Area
                  </p>
                  <h3 className="text-lg font-black uppercase tracking-tighter">
                    {currentLabel}
                  </h3>
                </div>
              </div>

              <Menu placement="bottom-end">
                <MenuTrigger>
                  {({ toggleMenu }) => (
                    <Button
                      type="button"
                      variant="outlined"
                      size="sm"
                      onClick={toggleMenu}
                      className="gap-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <span className="hidden sm:block text-left leading-tight">
                        <span className="block text-xs font-black uppercase tracking-[0.25em] text-white/30">
                          {user?.name ?? "Admin"}
                        </span>
                        <span className="block text-[10px] text-white/45 normal-case tracking-normal">
                          {user?.email ?? ""}
                        </span>
                      </span>
                      <ChevronDown className="size-4" />
                    </Button>
                  )}
                </MenuTrigger>
                <MenuItem onClick={() => router.push("/admin")}>
                  <span className="flex items-center gap-3">
                    <ArrowRight className="size-4" />
                    <span>Dashboard</span>
                  </span>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <span className="flex items-center gap-3 text-red-500">
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </span>
                </MenuItem>
              </Menu>
            </div>

            <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all",
                      active
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
