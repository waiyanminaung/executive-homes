import { BadgeDollarSign, Handshake, ShieldCheck } from "lucide-react";
import type {
  HomeNavItem,
  WhyItem,
} from "./types";

export const WALKING_SPEED_METERS_PER_MIN = 80;

export const PLACEHOLDER_IMAGE_URL = "/property-placeholder.png";

export const HOME_HERO_FILTER_OPTIONS = {
  prices: [
    { value: "0-5m", label: "Under ฿5M" },
    { value: "5m-10m", label: "฿5M – ฿10M" },
    { value: "10m-20m", label: "฿10M – ฿20M" },
    { value: "20m-50m", label: "฿20M – ฿50M" },
    { value: "50m+", label: "Over ฿50M" },
  ],
  bedrooms: [
    { value: "0", label: "Studio" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5+" },
  ],
};

export const HOME_NAV_ITEMS: HomeNavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Buy",
    href: "/property-for-sale",
    hasDropdown: true,
    dropdownColumns: [
      {
        title: "Property Types",
        links: [
          { label: "Condos", href: "/condo-for-sale" },
          { label: "Apartments", href: "/apartment-for-sale" },
          { label: "Houses", href: "/house-for-sale" },
          { label: "Office Spaces", href: "/office-space-for-sale" },
          { label: "Penthouses", href: "/penthouse-for-sale" },
          { label: "Villas", href: "/villa-for-sale" },
        ],
      },
      {
        title: "Bangkok Districts",
        links: [
          { label: "Sukhumvit", href: "/property-for-sale/bangkok/sukhumvit" },
          { label: "Sathorn", href: "/property-for-sale/bangkok/sathon" },
          { label: "Silom", href: "/property-for-sale/bangkok/silom" },
          { label: "Watthana", href: "/property-for-sale/bangkok/watthana" },
          { label: "Pathum Wan", href: "/property-for-sale/bangkok/pathum-wan" },
          { label: "Khlong Toei", href: "/property-for-sale/bangkok/khlong-toei" },
        ],
      },
    ],
  },
  {
    label: "Rent",
    href: "/property-for-rent",
    hasDropdown: true,
    dropdownColumns: [
      {
        title: "Property Types",
        links: [
          { label: "Condos", href: "/condo-for-rent" },
          { label: "Apartments", href: "/apartment-for-rent" },
          { label: "Houses", href: "/house-for-rent" },
          { label: "Office Spaces", href: "/office-space-for-rent" },
          { label: "Penthouses", href: "/penthouse-for-rent" },
          { label: "Villas", href: "/villa-for-rent" },
        ],
      },
      {
        title: "Bangkok Districts",
        links: [
          { label: "Sukhumvit", href: "/property-for-rent/bangkok/sukhumvit" },
          { label: "Sathorn", href: "/property-for-rent/bangkok/sathon" },
          { label: "Silom", href: "/property-for-rent/bangkok/silom" },
          { label: "Watthana", href: "/property-for-rent/bangkok/watthana" },
          { label: "Pathum Wan", href: "/property-for-rent/bangkok/pathum-wan" },
          { label: "Khlong Toei", href: "/property-for-rent/bangkok/khlong-toei" },
        ],
      },
    ],
  },
];

export const WHY_EXECUTIVE_HOMES_ITEMS: WhyItem[] = [
  {
    title: "Curated Excellence",
    description: "We offer only the top 1% of luxury properties in Thailand.",
    icon: ShieldCheck,
  },
  {
    title: "Direct Agency",
    description: "Transparent pricing and seamless transactions.",
    icon: Handshake,
  },
  {
    title: "Free for you",
    description: "Full support on legal paperwork and property ownership.",
    icon: BadgeDollarSign,
  },
];

