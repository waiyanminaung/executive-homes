import type { LucideIcon } from "lucide-react";

export interface HomeNavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface AreaCard {
  name: string;
  listings: number;
  imageUrl: string;
  featured?: boolean;
}

export interface PropertyItem {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrls: string[];
  status: "Sale" | "Rent";
  beds: number;
  baths: number;
  area: string;
}

export interface PropertySection {
  title: string;
  properties: PropertyItem[];
}

export interface WhyItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}
