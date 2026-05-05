"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Film,
  Grid2x2,
  Images,
  LayoutDashboard,
  MessageSquareWarning,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { Button, Menu, MenuItem, MenuTrigger } from "@geckoui/geckoui";
import { authClient } from "@/lib/auth-client";
import { classNames } from "@/utils/classNames";

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "ရုပ်ရှင်များ", icon: Film },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/categories", label: "မီနူးများ", icon: Grid2x2 },
  {
    href: "/admin/requests",
    label: "တောင်းဆိုမှုများ",
    icon: MessageSquareWarning,
  },
  { href: "/admin/reports", label: "တိုင်ကြားမှုများ", icon: ShieldAlert },
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

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session.data?.user;
  const initials = getInitials(user?.name);

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/admin/login");
  };

  return (
    <div
      className={classNames(
        "min-h-screen bg-[#0A0A0A] text-white",
        "px-4 py-6 pb-24 lg:px-12 lg:py-12",
      )}
    >
      <header
        className={classNames(
          "mx-auto mb-8 flex max-w-7xl flex-col gap-6 lg:mb-12",
        )}
      >
        <div
          className={classNames(
            "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
          )}
        >
          <div
            className={classNames(
              "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8",
            )}
          >
            <Link
              href="/"
              className={classNames(
                "flex size-11 items-center justify-center rounded-full",
                "border border-white/5 bg-white/5 text-white transition-all hover:bg-white/10",
              )}
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1
                className={classNames(
                  "mb-1 text-3xl font-black uppercase tracking-tighter text-white",
                  "lg:mb-2 lg:text-5xl",
                )}
              >
                Backend Admin
              </h1>
              <p
                className={classNames(
                  "text-[10px] font-black uppercase tracking-widest text-white/40",
                  "lg:text-sm",
                )}
              >
                ပိတ်ကား - စီမံခန့်ခွဲရေးဌာန
              </p>
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
                  className={classNames(
                    "w-fit gap-3 rounded-full border-white/10 bg-white/5",
                    "p-0 text-white shadow-lg shadow-black/10",
                    "hover:border-accent/30 hover:bg-white/10",
                  )}
                >
                  <span
                    className={classNames(
                      "flex size-11 items-center justify-center rounded-full",
                      "bg-accent text-sm font-black uppercase tracking-tight text-white",
                      "shadow-lg shadow-accent/20",
                    )}
                  >
                    {initials}
                  </span>
                </Button>
              )}
            </MenuTrigger>
            <div
              className={classNames(
                "border-b border-white/5 px-4 py-3",
                "text-left",
              )}
            >
              <p
                className={classNames(
                  "text-xs font-black uppercase tracking-[0.25em] text-white",
                )}
              >
                {user?.name ?? "Admin"}
              </p>
              <p className="mt-1 max-w-56 truncate text-[10px] text-white/45">
                {user?.email ?? ""}
              </p>
            </div>
            <MenuItem onClick={handleLogout}>
              <span className="flex items-center gap-3 text-red-500">
                <LogOut className="size-4" />
                <span>Logout</span>
              </span>
            </MenuItem>
          </Menu>
        </div>

        <nav
          className={classNames(
            "flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl",
            "border border-white/5 bg-white/5 p-1 no-scrollbar lg:p-1.5",
          )}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "flex items-center gap-2 whitespace-nowrap rounded-xl",
                  "px-4 py-2.5 text-[9px] font-black uppercase tracking-widest",
                  "transition-all lg:gap-3 lg:px-6 lg:py-3 lg:text-[10px]",
                  active
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-white/40 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-3.5 lg:size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl">{children}</main>

      <footer
        className={classNames(
          "mx-auto mt-20 max-w-7xl border-t border-white/5 py-12 text-center",
        )}
      >
        <p
          className={classNames(
            "text-[10px] font-black uppercase italic tracking-[0.5em] text-white/10",
          )}
        >
          ပိတ်ကား - Supreme Admin Interface
        </p>
      </footer>
    </div>
  );
}
