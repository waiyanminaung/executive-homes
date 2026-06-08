import Link from "next/link";
import type { ContactMethod } from "../types";

interface ContactInfoProps {
  methods: ContactMethod[];
}

export function ContactInfo({ methods }: ContactInfoProps) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-detail-card md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-500">
        Direct contact
      </p>
      <h2 className="mt-2 text-2xl font-bold text-neutral-950 md:text-[30px]">
        Reach our Bangkok team
      </h2>
      <p className="mt-3 text-base leading-7 text-neutral-600">
        Prefer a quick conversation? Choose the channel that works best for you.
      </p>

      <div className="mt-7 grid gap-4">
        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <Link
              key={method.title}
              href={method.href}
              className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-gray-300 hover:bg-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition-colors group-hover:bg-primary-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-semibold leading-5 text-neutral-950">
                  {method.title}
                </span>
                <span className="mt-2 block text-base leading-6 text-neutral-700">
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
