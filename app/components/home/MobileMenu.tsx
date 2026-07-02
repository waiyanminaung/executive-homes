"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { classNames } from "@/utils/classNames";
import type { HomeNavItem } from "@/app/types";

interface MobileNavItemProps {
  item: HomeNavItem;
  onClose: () => void;
}

function MobileNavItem({ item, onClose }: MobileNavItemProps) {
  const [expanded, setExpanded] = useState(false);

  if (!item.dropdownColumns) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
      >
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10"
      >
        <span>{item.label}</span>
        <ChevronDown
          className={classNames("h-4 w-4 text-white/70 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>

      {expanded && (
        <div className="ml-4 grid gap-0.5 border-l border-white/10 pl-4">
          {item.dropdownColumns.flatMap((col) => col.links).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface MobileMenuProps {
  navItems: HomeNavItem[];
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ navItems, open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div
        onClick={onClose}
        className={classNames(
          "fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        className={classNames(
          "fixed inset-y-0 right-0 z-[95] flex w-[80%] max-w-xs flex-col overflow-hidden bg-secondary-900 shadow-[-18px_0_40px_rgb(0_0_0/0.3)] transition-transform duration-300 max-[425px]:w-full max-[425px]:max-w-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Image
          src="/logo-icon.svg"
          alt=""
          aria-hidden
          width={320}
          height={320}
          className="pointer-events-none absolute -bottom-16 -right-16 z-0 h-72 w-72 opacity-[0.06]"
        />

        <div className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <span className="text-sm font-bold text-white/90">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative z-10 flex flex-1 flex-col gap-1 overflow-y-auto p-4 text-sm font-semibold text-white">
          {navItems.map((item) => (
            <MobileNavItem key={item.label} item={item} onClose={onClose} />
          ))}
          <Link
            href="/about"
            onClick={onClose}
            className="rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
          >
            About Us
          </Link>
        </nav>

        <div className="relative z-10 shrink-0 border-t border-white/10 p-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="block rounded-xl bg-gradient-to-b from-primary-500 to-primary-400 px-4 py-3 text-center text-sm font-bold text-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
