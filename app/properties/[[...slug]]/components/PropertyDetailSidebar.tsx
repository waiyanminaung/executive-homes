"use client";

import Image from "next/image";
import { Button, Dialog } from "@geckoui/geckoui";
import { PROPERTY_CONTACT_ITEMS } from "../constants";
import { PropertyEnquiryForm } from "./PropertyEnquiryForm";

function openEnquiryDialog() {
  Dialog.show({
    content: ({ dismiss }) => <PropertyEnquiryForm dismiss={dismiss} />,
  });
}

export function PropertyDetailSidebar() {
  return (
    <aside className="lg:sticky lg:top-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-detail-card">
        <Button
          type="button"
          onClick={openEnquiryDialog}
          className="h-[46px] w-full rounded-md bg-primary-500 px-6 text-base font-bold !text-white hover:bg-primary-600"
        >
          Enquiry Now
        </Button>

        <div className="my-3 flex items-center justify-center gap-3 py-2.5">
          <span className="h-px w-20 bg-gray-400/80" />
          <span className="text-xs font-semibold leading-[18px] text-neutral-600">
            Or Contact us via
          </span>
          <span className="h-px w-20 bg-gray-400/80" />
        </div>

        <div className="grid gap-2.5">
          {PROPERTY_CONTACT_ITEMS.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="outlined"
              className="h-[56px] justify-start rounded-md bg-white px-4 text-base font-medium !text-neutral-950 shadow-none hover:bg-gray-50"
            >
              <Image src={item.iconUrl} alt="" width={30} height={30} className="h-[30px] w-[30px]" />
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
