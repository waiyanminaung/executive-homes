import Image from "next/image";
import Link from "next/link";
import type { FooterColumn } from "@/app/types";

interface HomeFooterProps {
  columns: FooterColumn[];
}

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", src: "https://img.icons8.com/fluency/96/facebook-new.png", size: 45 },
  { href: "https://instagram.com", label: "Instagram", src: "https://img.icons8.com/fluency/96/instagram-new.png", size: 45 },
  { href: "https://line.me", label: "Line", src: "https://img.icons8.com/fluency/96/line-me.png", size: 45 },
];

export function HomeFooter({ columns }: HomeFooterProps) {
  return (
    <footer className="bg-secondary-900 text-slate-300">
      <div className="flex justify-center gap-4 border-b border-white/10 py-4">
        {SOCIAL_LINKS.map((social) => (
          <Link key={social.label} href={social.href} aria-label={social.label} className="opacity-90 transition-opacity hover:opacity-100">
            <Image src={social.src} alt={social.label} width={social.size} height={social.size} />
          </Link>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-bold text-white">{column.title}</h3>
              <ul className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm font-normal text-white/80">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-white/10" />
        <p className="mt-5 text-center text-xs font-semibold leading-5 text-white/75 md:text-sm">
          © 2026 Executive Homes Co., Ltd. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
