import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { PropertyShareButton } from "./PropertyShareButton";

interface PropertyDetailBreadcrumbProps {
  title: string;
}

export function PropertyDetailBreadcrumb({ title }: PropertyDetailBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-3 overflow-hidden py-[14px] text-sm font-medium">
      <Link
        href="/properties"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-neutral-700 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-500"
        aria-label="Back to properties"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <ol className="flex min-w-0 flex-1 items-center gap-1.5">
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

      <PropertyShareButton title={title} />
    </nav>
  );
}
