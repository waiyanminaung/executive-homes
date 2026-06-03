"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@geckoui/geckoui";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";

interface HomeHeaderProps {
  navItems: HomeNavItem[];
}

export function HomeHeader({ navItems }: HomeHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={classNames(
        "fixed inset-x-0 top-0 z-[60] transition-all duration-300",
        scrolled ? "bg-[#0e2638]/95 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className={classNames("container mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-4 transition-all duration-300", scrolled ? "h-20" : "h-24")}>
        <nav
          className={classNames(
            "hidden items-center gap-8 text-sm font-semibold md:flex transition-colors duration-300",
            "text-white/90",
          )}
        >
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-1 hover:text-[#ae894c] transition-colors">
              <span>{item.label}</span>
              {item.hasDropdown ? <ChevronDown className="h-3.5 w-3.5" /> : null}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex justify-center" aria-label="Executive Homes">
          {scrolled ? (
            <Image src="/logo-icon.svg" alt="Executive Homes" width={56} height={56} className="h-14 w-14" />
          ) : (
            <Image src="/logo-full.svg" alt="Executive Homes" width={140} height={72} className="h-[72px] w-[140px]" />
          )}
        </Link>

        <div
          className={classNames(
            "flex items-center justify-end gap-6 text-sm font-semibold transition-colors duration-300",
            "text-white/90",
          )}
        >
          <Link href="/about-us" className="hidden hover:text-[#ae894c] transition-colors md:inline">
            About Us
          </Link>
          <Button
            type="button"
            variant="outlined"
            className={classNames(
              "h-10 rounded-md px-5 text-sm font-bold transition-all",
              "border-white/70 text-white hover:bg-white/10",
            )}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </header>
  );
}
