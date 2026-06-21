import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getContactInfo } from "@/lib/getContactInfo";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import type { ContactMethod } from "../types";

export async function ContactMain() {
  const info = await getContactInfo();

  const methods: ContactMethod[] = [
    info.phone && {
      title: "Call us",
      value: info.phone,
      href: `tel:${info.phone.replace(/\(0\)/g, "").replace(/[^\d+]/g, "")}`,
      icon: Phone,
    },
    info.email && {
      title: "Email support",
      value: info.email,
      href: `mailto:${info.email}`,
      icon: Mail,
    },
    info.whatsapp && {
      title: "Chat WhatsApp",
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp.replace(/\(0\)/g, "").replace(/[^\d]/g, "")}`,
      icon: MessageCircle,
    },
    info.address && {
      title: "Visit Us",
      value: info.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(info.address)}`,
      icon: MapPin,
    },
  ].filter(Boolean) as ContactMethod[];

  return (
    <section className="bg-white px-4 py-[70px]">
      <div className="mx-auto grid w-full max-w-[1186px] gap-6 lg:grid-cols-[minmax(0,572px)_minmax(0,1fr)]">
        <ContactForm />
        <ContactInfo methods={methods} />
      </div>
    </section>
  );
}
