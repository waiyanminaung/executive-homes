import Image from "next/image";
import Link from "next/link";
import type { FooterColumn } from "@/app/types";

interface HomeFooterProps {
  columns: FooterColumn[];
}

const SOCIAL_LINKS = [
  { href: "#", label: "Facebook", src: "https://img.icons8.com/fluency/96/facebook-new.png", size: 45 },
  { href: "#", label: "Instagram", src: "https://img.icons8.com/fluency/96/instagram-new.png", size: 45 },
  { href: "#", label: "Line", src: "https://img.icons8.com/fluency/96/line-me.png", size: 45 },
];

export function HomeFooter({ columns }: HomeFooterProps) {
  return (
    <footer className="bg-[#0e2638] text-slate-300">
      <div className="flex justify-center gap-4 border-b border-[#1f415a] py-4">
        {SOCIAL_LINKS.map((social) => (
          <Link key={social.label} href={social.href} aria-label={social.label} className="opacity-90 transition-opacity hover:opacity-100">
            <Image src={social.src} alt={social.label} width={social.size} height={social.size} />
          </Link>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-bold text-white">{column.title}</h3>
              <ul className="mt-5 space-y-3">
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
        <div className="mt-8 border-t border-[#1f415a]" />
        <p className="mt-5 text-center text-sm font-semibold text-white/75">
          © 2026 Executive Homes Co., Ltd. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
