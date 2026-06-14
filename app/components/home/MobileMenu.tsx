import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { HomeNavItem } from "@/app/types";

interface MobileMenuProps {
  navItems: HomeNavItem[];
  onClose: () => void;
}

export function MobileMenu({ navItems, onClose }: MobileMenuProps) {
  return (
    <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-secondary-900/95 p-4 shadow-[0_18px_40px_rgb(0_0_0/0.24)] backdrop-blur-md md:hidden">
      <nav className="grid gap-1 text-sm font-semibold text-white">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
          >
            <span>{item.label}</span>
            {item.hasDropdown ? <ChevronDown className="h-4 w-4 text-white/70" /> : null}
          </Link>
        ))}
        <Link
          href="/about"
          onClick={onClose}
          className="rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
        >
          About Us
        </Link>
        <Link
          href="/contact"
          onClick={onClose}
          className="mt-2 rounded-xl bg-gradient-to-b from-primary-500 to-primary-400 px-4 py-3 text-center font-bold text-white"
        >
          Contact Us
        </Link>
      </nav>
    </div>
  );
}
