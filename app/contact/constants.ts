import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ContactMethod } from "./types";

export const CONTACT_HERO_BACKGROUND =
  "/banner.webp";

export const CONTACT_HERO_PERSON_IMAGE = "/staff-greeting.webp";

export const CONTACT_METHODS: ContactMethod[] = [
  {
    title: "Call us",
    value: "+66(0)92-598-7462",
    href: "tel:+660925987462",
    icon: Phone,
  },
  {
    title: "Email support",
    value: "ehb.bkk@gmail.com",
    href: "mailto:ehb.bkk@gmail.com",
    icon: Mail,
  },
  {
    title: "Chat WhatsApp",
    value: "+66(0)92-598-7462",
    href: "https://wa.me/660925987462",
    icon: MessageCircle,
  },
  {
    title: "Visit Us",
    value: "59/109 Soi 26 Sukhumvit Rd, Klongtoey, Bangkok",
    href: "https://maps.google.com/?q=59%2F109%20Soi%2026%20Sukhumvit%20Rd%2C%20Klongtoey%2C%20Bangkok",
    icon: MapPin,
  },
];
