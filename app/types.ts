import type { LucideIcon } from "lucide-react";

export interface NavDropdownColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface HomeNavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownColumns?: NavDropdownColumn[];
}

export interface AreaCard {
  name: string;
  listings: number;
  imageUrl: string;
  featured?: boolean;
}

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  hasMultipleTiers: boolean;
  imageUrls: string[];
  listingType: "Sale" | "Rent" | "Sale & Rent";
  availabilityStatus: "AVAILABLE" | "SOLD" | "RENTED";
  beds: number;
  baths: number;
  area: string;
}

export interface PropertySection {
  title: string;
  viewMoreHref: string;
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
