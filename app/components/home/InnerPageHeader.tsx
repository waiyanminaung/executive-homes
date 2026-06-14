"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";
import { HeaderNav } from "./HeaderNav";
import { MobileMenu } from "./MobileMenu";

interface InnerPageHeaderProps {
  navItems: HomeNavItem[];
}

export function InnerPageHeader({ navItems }: InnerPageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-[100] bg-secondary-900/95 shadow-sm backdrop-blur-md">
      <div className="container mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20">
        <div className="h-11 w-11 md:hidden" />

        <HeaderNav navItems={navItems} />

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

      {menuOpen && <MobileMenu navItems={navItems} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
