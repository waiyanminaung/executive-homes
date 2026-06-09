import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PropertyDetailBreadcrumbProps {
  title: string;
}

export function PropertyDetailBreadcrumb({ title }: PropertyDetailBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-center overflow-hidden py-[18px] text-sm font-medium">
      <ol className="flex min-w-0 max-w-full items-center justify-center gap-1.5">
        <li className="shrink-0">
          <Link href="/" className="text-neutral-600 transition-colors hover:text-primary-500">
            Home
          </Link>
        </li>
        <li className="flex shrink-0 items-center">
          <ChevronRight className="h-5 w-5 text-neutral-950" />
        </li>
        <li className="shrink-0">
          <Link href="/properties" className="text-neutral-600 transition-colors hover:text-primary-500">
            Properties
          </Link>
        </li>
        <li className="flex shrink-0 items-center">
          <ChevronRight className="h-5 w-5 text-neutral-950" />
        </li>
        <li className="min-w-0 truncate text-neutral-950" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
