"use client";

import Image from "next/image";
import { Button, Dialog } from "@geckoui/geckoui";
import { PropertyEnquiryForm } from "./PropertyEnquiryForm";
import type { ContactInfo } from "@/types/contactInfo";

const CONTACT_ICON_URLS: Record<string, string> = {
  line: "https://img.icons8.com/fluency/96/line-me.png",
  whatsapp: "https://img.icons8.com/fluency/96/whatsapp.png",
  phone: "https://img.icons8.com/fluency/96/phone--v1.png",
};

interface ContactButton {
  label: string;
  iconUrl: string;
  href: string;
}

function buildContactButtons(contactInfo: ContactInfo | null): ContactButton[] {
  if (!contactInfo) return [];

  const buttons: ContactButton[] = [];

  if (contactInfo.line) {
    buttons.push({ label: "Line", iconUrl: CONTACT_ICON_URLS.line, href: `https://line.me/ti/p/${contactInfo.line}` });
  }

  if (contactInfo.whatsapp) {
    buttons.push({ label: "WhatsApp", iconUrl: CONTACT_ICON_URLS.whatsapp, href: `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}` });
  }

  if (contactInfo.phone) {
    buttons.push({ label: contactInfo.phone, iconUrl: CONTACT_ICON_URLS.phone, href: `tel:${contactInfo.phone}` });
  }

  return buttons;
}

function openEnquiryDialog() {
  Dialog.show({
    content: ({ dismiss }) => <PropertyEnquiryForm dismiss={dismiss} />,
  });
}

interface PropertyDetailSidebarProps {
  contactInfo: ContactInfo | null;
}

export function PropertyDetailSidebar({ contactInfo }: PropertyDetailSidebarProps) {
  const contactButtons = buildContactButtons(contactInfo);

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

        {contactButtons.length > 0 && (
          <>
            <div className="my-3 flex items-center justify-center gap-3 py-2.5">
              <span className="h-px w-20 bg-gray-400/80" />
              <span className="text-xs font-semibold leading-[18px] text-neutral-600">
                Or Contact us via
              </span>
              <span className="h-px w-20 bg-gray-400/80" />
            </div>

            <div className="grid gap-2.5">
              {contactButtons.map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  variant="outlined"
                  className="h-[56px] justify-start rounded-md bg-white px-4 text-base font-medium !text-neutral-950 shadow-none hover:bg-gray-50"
                  onClick={() => window.open(item.href, "_blank")}
                >
                  <Image src={item.iconUrl} alt="" width={30} height={30} className="h-[30px] w-[30px]" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
