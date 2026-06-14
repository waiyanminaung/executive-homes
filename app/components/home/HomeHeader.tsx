"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";
import { HeaderNav } from "./HeaderNav";
import { MobileMenu } from "./MobileMenu";

interface HomeHeaderProps {
  navItems: HomeNavItem[];
  hideLogo?: boolean;
}

export function HomeHeader({ navItems, hideLogo }: HomeHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-[60] bg-transparent">
      <div className="container mx-auto grid h-20 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-24">
        <div className="h-11 w-11 md:hidden" />

        <HeaderNav navItems={navItems} />

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
            className="hidden h-10 items-center rounded-md border border-white/70 px-5 text-sm font-bold text-white transition-all hover:bg-white/10 md:inline-flex"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {menuOpen && <MobileMenu navItems={navItems} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
