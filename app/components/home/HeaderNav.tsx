"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";

interface HeaderNavProps {
  navItems: HomeNavItem[];
}

export function HeaderNav({ navItems }: HeaderNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden items-center gap-8 text-sm font-semibold text-white/90 transition-colors duration-300 md:flex">
      {navItems.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.dropdownColumns && setActiveDropdown(item.label)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <Link
            href={item.href}
            className="flex items-center gap-1 transition-colors hover:text-primary-500"
          >
            <span>{item.label}</span>
            {item.hasDropdown ? (
              <ChevronDown
                className={classNames(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  activeDropdown === item.label && "rotate-180",
                )}
              />
            ) : null}
          </Link>

          {item.dropdownColumns && activeDropdown === item.label && (
            <div className="absolute left-0 top-full z-[200] pt-3">
              <div className="min-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-secondary-900/97 shadow-[0_20px_60px_rgb(0_0_0/0.35)] backdrop-blur-md">
                <div className="grid grid-cols-2 gap-px bg-white/5">
                  {item.dropdownColumns.map((col) => (
                    <div key={col.title} className="bg-secondary-900 px-5 py-5">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary-400">
                        {col.title}
                      </p>
                      <ul className="grid gap-1">
                        {col.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/8 hover:text-white"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 px-5 py-3">
                  <Link
                    href={item.href}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 transition-colors hover:text-primary-300"
                  >
                    <span>
                      View all {item.label === "Buy" ? "properties for sale" : "properties for rent"}
                    </span>
                    <ChevronDown className="-rotate-90 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
