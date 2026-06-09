"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";

interface HomeHeaderProps {
  navItems: HomeNavItem[];
  hideLogo?: boolean;
}

export function HomeHeader({ navItems, hideLogo }: HomeHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-[60] bg-transparent">
      <div
        className="container mx-auto grid h-20 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-24"
      >
        <div className="h-11 w-11 md:hidden" />

        <nav
          className={classNames(
            "hidden items-center gap-8 text-sm font-semibold md:flex transition-colors duration-300",
            "text-white/90",
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 transition-colors hover:text-primary-500"
            >
              <span>{item.label}</span>
              {item.hasDropdown ? <ChevronDown className="h-3.5 w-3.5" /> : null}
            </Link>
          ))}
        </nav>

        {!hideLogo ? (
          <Link href="/" className="flex justify-center" aria-label="Executive Homes">
            <Image src="/logo-full.svg" alt="Executive Homes" width={140} height={72} className="h-14 w-[109px] md:h-[72px] md:w-[140px]" />
          </Link>
        ) : (
          <div />
        )}

        <div
          className={classNames(
            "flex items-center justify-end gap-6 text-sm font-semibold transition-colors duration-300",
            "text-white/90",
          )}
        >
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/about" className="hidden transition-colors hover:text-primary-500 md:inline">
            About Us
          </Link>
          <Link
            href="/contact"
            className={classNames(
              "hidden h-10 items-center rounded-md border border-white/70 px-5 text-sm font-bold text-white transition-all hover:bg-white/10 md:inline-flex",
            )}
          >
            Contact Us
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-secondary-900/95 p-4 shadow-[0_18px_40px_rgb(0_0_0/0.24)] backdrop-blur-md md:hidden">
          <nav className="grid gap-1 text-sm font-semibold text-white">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
              >
                <span>{item.label}</span>
                {item.hasDropdown ? <ChevronDown className="h-4 w-4 text-white/70" /> : null}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-b from-primary-500 to-primary-400 px-4 py-3 text-center font-bold text-white"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
