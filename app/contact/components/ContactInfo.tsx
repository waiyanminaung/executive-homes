import Link from "next/link";
import type { ContactMethod } from "../types";

interface ContactInfoProps {
  methods: ContactMethod[];
}

export function ContactInfo({ methods }: ContactInfoProps) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-detail-card md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-500 md:text-sm">
        Direct contact
      </p>
      <h2 className="mt-1.5 text-xl font-bold text-neutral-950 md:mt-2 md:text-[30px]">
        Reach our Bangkok team
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600 md:mt-3 md:text-base md:leading-7">
        Prefer a quick conversation? Choose the channel that works best for you.
      </p>

      <div className="mt-4 grid gap-3 md:mt-7 md:gap-4">
        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <Link
              key={method.title}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-gray-300 hover:bg-white md:gap-4 md:p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-colors group-hover:bg-primary-600 md:h-11 md:w-11">
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold leading-5 text-neutral-950 md:text-lg">
                  {method.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-neutral-700 md:mt-2 md:text-base md:leading-6">
                  {method.value}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
