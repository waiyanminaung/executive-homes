"use client";

import { useState } from "react";
import Link from "next/link";

const VISIBLE_COUNT = 6;

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkListProps {
  links: FooterLink[];
}

export function FooterLinkList({ links }: FooterLinkListProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? links : links.slice(0, VISIBLE_COUNT);
  const hasMore = links.length > VISIBLE_COUNT;

  return (
    <ul className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
      {visible.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="text-sm font-normal text-white/80">
            {link.label}
          </Link>
        </li>
      ))}

      {hasMore && (
        <li>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm font-normal text-white/60 hover:text-white/80 transition-colors"
          >
            {showAll ? "Show less" : `Show more (${links.length - VISIBLE_COUNT} more)`}
          </button>
        </li>
      )}
    </ul>
  );
}
