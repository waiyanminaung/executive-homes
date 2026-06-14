import { BadgeDollarSign, Handshake, ShieldCheck } from "lucide-react";
import type {
  AreaCard,
  FooterColumn,
  HomeNavItem,
  PropertyItem,
  PropertySection,
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

export const HOME_AREA_CARDS: AreaCard[] = [
  {
    name: "Bangkok",
    listings: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    name: "Sathorn",
    listings: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Nana",
    listings: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Riverside",
    listings: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Ekkamai",
    listings: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Ratchadamri",
    listings: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Chidlom",
    listings: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Bangna",
    listings: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1555217851-6141535bd771?auto=format&fit=crop&w=900&q=85",
  },
];

const rentProperties: PropertyItem[] = [
  {
    id: "rent-1",
    title: "2 Bed Luxury Apartment Sukhumvit 11",
    location: "Sukhumvit, Watthana, Bangkok",
    price: 45000,
    status: "Rent",
    beds: 2,
    baths: 2,
    area: "72.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "rent-2",
    title: "3 Bed High Rise Condo Asoke BTS",
    location: "Asoke, Watthana, Bangkok",
    price: 65000,
    status: "Rent",
    beds: 3,
    baths: 3,
    area: "110.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "rent-3",
    title: "1 Bed Studio Thonglor Premium",
    location: "Thonglor, Khlong Toei, Bangkok",
    price: 28000,
    status: "Rent",
    beds: 1,
    baths: 1,
    area: "45.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "rent-4",
    title: "4 Bed Penthouse Silom Road",
    location: "Silom, Bang Rak, Bangkok",
    price: 120000,
    status: "Rent",
    beds: 4,
    baths: 4,
    area: "220.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "rent-5",
    title: "2 Bed Serviced Apartment Ploenchit",
    location: "Ploenchit, Pathum Wan, Bangkok",
    price: 55000,
    status: "Rent",
    beds: 2,
    baths: 2,
    area: "88.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "rent-6",
    title: "3 Bed Family Apartment Nana BTS",
    location: "Nana, Watthana, Bangkok",
    price: 70000,
    status: "Rent",
    beds: 3,
    baths: 2,
    area: "130.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

const saleProperties: PropertyItem[] = [
  {
    id: "sale-1",
    title: "2 Bed Luxury Condo Sukhumvit 24",
    location: "Sukhumvit, Khlong Toei, Bangkok",
    price: 8500000,
    status: "Sale",
    beds: 2,
    baths: 2,
    area: "75.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "sale-2",
    title: "3 Bed Pool Villa Pattanakarn",
    location: "Pattanakarn, Suan Luang, Bangkok",
    price: 18000000,
    status: "Sale",
    beds: 3,
    baths: 3,
    area: "260.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "sale-3",
    title: "1 Bed Investment Condo Phrom Phong",
    location: "Phrom Phong, Watthana, Bangkok",
    price: 5200000,
    status: "Sale",
    beds: 1,
    baths: 1,
    area: "38.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "sale-4",
    title: "4 Bed Townhouse Sathorn Road",
    location: "Sathorn, Bang Rak, Bangkok",
    price: 32000000,
    status: "Sale",
    beds: 4,
    baths: 5,
    area: "380.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "sale-5",
    title: "2 Bed Corner Unit Asoke Tower",
    location: "Asoke, Watthana, Bangkok",
    price: 9800000,
    status: "Sale",
    beds: 2,
    baths: 2,
    area: "82.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "sale-6",
    title: "3 Bed Duplex Ekkamai Residences",
    location: "Ekkamai, Watthana, Bangkok",
    price: 14500000,
    status: "Sale",
    beds: 3,
    baths: 3,
    area: "165.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

const condoProperties: PropertyItem[] = [
  {
    id: "condo-1",
    title: "1 Bed High Floor Condo Chidlom",
    location: "Chidlom, Pathum Wan, Bangkok",
    price: 6800000,
    status: "Sale",
    beds: 1,
    baths: 1,
    area: "42.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "condo-2",
    title: "2 Bed Sky Residence Ratchadamri",
    location: "Ratchadamri, Pathum Wan, Bangkok",
    price: 15000000,
    status: "Sale",
    beds: 2,
    baths: 2,
    area: "95.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "condo-3",
    title: "3 Bed Penthouse Silom Prestige",
    location: "Silom, Bang Rak, Bangkok",
    price: 38000000,
    status: "Sale",
    beds: 3,
    baths: 4,
    area: "280.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "condo-4",
    title: "1 Bed Smart Condo Thonglor 13",
    location: "Thonglor, Khlong Toei, Bangkok",
    price: 4900000,
    status: "Sale",
    beds: 1,
    baths: 1,
    area: "35.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "condo-5",
    title: "2 Bed Garden View Phrom Phong",
    location: "Phrom Phong, Watthana, Bangkok",
    price: 11200000,
    status: "Sale",
    beds: 2,
    baths: 2,
    area: "78.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "condo-6",
    title: "4 Bed Duplex Sathorn Grand Tower",
    location: "Sathorn, Bang Rak, Bangkok",
    price: 52000000,
    status: "Sale",
    beds: 4,
    baths: 4,
    area: "310.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

export const HOME_PROPERTY_SECTIONS: PropertySection[] = [
  { title: "Featured Properties", properties: saleProperties },
  { title: "Apartment for rent in Bangkok", properties: rentProperties },
  { title: "Condos for sale in Bangkok", properties: condoProperties },
];

export const MOCK_PROPERTIES: PropertyItem[] = [
  ...saleProperties,
  ...rentProperties,
  ...condoProperties,
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
