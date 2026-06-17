import { BadgeDollarSign, Handshake, ShieldCheck } from "lucide-react";
import type {
  FooterColumn,
  HomeNavItem,
  WhyItem,
} from "./types";

export const HOME_HERO_FILTER_OPTIONS = {
  types: [
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "house", label: "House" },
    { value: "office", label: "Office Space" },
    { value: "commercial", label: "Commercial" },
  ],
  locations: [
    { value: "sukhumvit", label: "Sukhumvit" },
    { value: "silom", label: "Silom" },
    { value: "sathorn", label: "Sathorn" },
    { value: "riverside", label: "Riverside" },
    { value: "watthana", label: "Watthana" },
  ],
  prices: [
    { value: "0-5m", label: "Under ฿5M" },
    { value: "5m-10m", label: "฿5M – ฿10M" },
    { value: "10m-20m", label: "฿10M – ฿20M" },
    { value: "20m-50m", label: "฿20M – ฿50M" },
    { value: "50m+", label: "Over ฿50M" },
  ],
  bedrooms: [
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4 Bedrooms" },
    { value: "5+", label: "5+ Bedrooms" },
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
  { label: "Projects", href: "/property-for-sale" },
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

export const HOME_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Property for Sales",
    links: [
      { label: "Condos for Sale", href: "/condo-for-sale" },
      { label: "Houses for Sale", href: "/house-for-sale" },
      { label: "Apartment for Sale", href: "/apartment-for-sale" },
      { label: "Office space for Sale", href: "/office-space-for-sale" },
      { label: "Commercial space for Sale", href: "/commercial-space-for-sale" },
      { label: "Penthouse for Sale", href: "/penthouse-for-sale" },
    ],
  },
  {
    title: "Property for Rents",
    links: [
      { label: "Condos for Rent", href: "/condo-for-rent" },
      { label: "Houses for Rent", href: "/house-for-rent" },
      { label: "Apartment for Rent", href: "/apartment-for-rent" },
      { label: "Office space for Rent", href: "/office-space-for-rent" },
      { label: "Commercial space for Rent", href: "/commercial-space-for-rent" },
      { label: "Penthouse for Rent", href: "/penthouse-for-rent" },
    ],
  },
  {
    title: "Property Types",
    links: [
      { label: "Apartment", href: "/apartment-for-sale" },
      { label: "Commercial Space", href: "/commercial-space-for-sale" },
      { label: "Condo", href: "/condo-for-sale" },
      { label: "House", href: "/house-for-sale" },
      { label: "Office Space", href: "/office-space-for-sale" },
      { label: "Penthouse", href: "/penthouse-for-sale" },
    ],
  },
  {
    title: "Property within Bangkok Area",
    links: [
      { label: "Property for sale in Watthana", href: "/property-for-sale/bangkok/watthana" },
      { label: "Properties for sale in Khlong Toei", href: "/property-for-sale/bangkok/khlong-toei" },
      { label: "Properties for sale in Pathum Wan", href: "/property-for-sale/bangkok/pathum-wan" },
      { label: "Properties for sale in Huai Khwang", href: "/property-for-sale/bangkok/huai-khwang" },
      { label: "Properties for sale in Bang Rak", href: "/property-for-sale/bangkok/bang-rak" },
      { label: "Properties for sale in Ratchathewi", href: "/property-for-sale/bangkok/ratchathewi" },
    ],
  },
];
