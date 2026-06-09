"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";

interface InnerPageHeaderProps {
  navItems: HomeNavItem[];
}

export function InnerPageHeader({ navItems }: InnerPageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-secondary-900/95 shadow-sm backdrop-blur-md">
      <div className="container mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20">
        <div className="h-11 w-11 md:hidden" />

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/90 md:flex">
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

        <Link href="/" className="flex justify-center" aria-label="Executive Homes">
          <Image
            src="/logo-icon.svg"
            alt="Executive Homes"
            width={56}
            height={56}
            className="h-12 w-12 md:h-16 md:w-16"
          />
        </Link>

        <div className="flex items-center justify-end gap-6 text-sm font-semibold text-white/90">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white md:hidden"
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
