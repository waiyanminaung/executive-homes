import {
  AirVent,
  Bath,
  BedDouble,
  Building2,
  Car,
  Dumbbell,
  HousePlug,
  LampDesk,
  LandPlot,
  MapPin,
  Maximize2,
  ShieldCheck,
  ShoppingBag,
  Sofa,
  Waves,
  WashingMachine,
} from "lucide-react";
import type { PropertyItem } from "@/app/types";
import type { PropertyContactItem, PropertyDetail } from "./types";

const propertyImages = [
  "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
];

const description = `Unit Details:
- Fully fitted and partially furnished
- 3 bedrooms, each with a bed and en-suite bathroom
- Master bedroom includes a single-seat sofa bed, walk-in closet, and a bathtub
- Office / Family Room with a two-seat sofa bed
- Hall / Foyer / Reception / Living & Dining Area featuring a 6-seat dining table set and a three-seat sofa with ottoman
- Powder Room (Guest Bathroom)
- Counter Bar
- Kitchen
- Utility Room (wet area for washing)
- Maid's Bathroom
- Laundry / Maid's Quarters
- Dedicated Parking: 2 spaces on the 1st floor

Installed Equipment:
1. Franke kitchen sink
2. Faucets by Kohler, Toto, and Cotto
3. Oven, microwave, and induction stove by Gorenje
4. Cooker hood by Fotile
5. Ceiling fans by Mr. Ken
6. Sanitary ware, washbasins, bathtubs, faucets, and bidet sprays by Toto, Kohler, Cristina Nahm, and Cotto
7. Shower glass partition by Shower Plus
8. Sliding glass panels at the kitchen counter custom-made by Aluminum Perfect System
9. Curtains by PASAYA
10. VRV air conditioning system by Daikin`;

export const PROPERTY_DETAIL: PropertyDetail = {
  id: "somkid-gardens",
  title: "Somkid Gardens Condominium floor 20th",
  location: "Bang Phlat, Bangkok",
  address: "Soi Somkid, between Central Chidlom and Central Embassy.",
  price: "THB 500,000",
  salePrice: "THB 500,000",
  rentPrice: "THB 40,000/mo",
  status: "Sale",
  beds: 3,
  baths: 3,
  area: "338.00 sqm",
  imageUrls: propertyImages,
  description,
  mapImageUrl:
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
  detailStats: [
    { label: "Area", value: "Bang Phlat", icon: MapPin },
    { label: "Property Type", value: "Condo", icon: Building2 },
    { label: "Property Size", value: "338.00 sqm", icon: Maximize2 },
    { label: "Bedrooms", value: "3 bedrooms", icon: BedDouble },
    { label: "Bathrooms", value: "3 bathrooms", icon: Bath },
    { label: "Pet Friendly", value: "Yes", icon: HousePlug },
  ],
  unitFeatures: [
    { label: "Air-conditioning", icon: AirVent },
    { label: "Bed", icon: BedDouble },
    { label: "Laundry", icon: WashingMachine },
    { label: "Bathtub", icon: Bath },
    { label: "Balcony", icon: LandPlot },
    { label: "Furnished", icon: Sofa },
  ],
  commonFacilities: [
    { label: "Swimming pool", icon: Waves },
    { label: "Convenience Store", icon: ShoppingBag },
    { label: "Fitness", icon: Dumbbell },
    { label: "Shuttle Bus", icon: LampDesk },
    { label: "Car park", icon: Car },
    { label: "24H Security", icon: ShieldCheck },
  ],
};

export const PROPERTY_CONTACT_ITEMS: PropertyContactItem[] = [
  { label: "Line", iconUrl: "https://img.icons8.com/fluency/96/line-me.png" },
  { label: "WhatsApp", iconUrl: "https://img.icons8.com/fluency/96/whatsapp.png" },
  { label: "+66 818 890 511", iconUrl: "https://img.icons8.com/fluency/96/phone--v1.png" },
];

export const SIMILAR_PROPERTY_CARDS: PropertyItem[] = [
  {
    id: "similar-1",
    title: "3 bedrooms for sale Park Court Sukhumvit 77",
    location: "Lamai Beach, Surat Thani",
    price: "THB 15,000,000",
    status: "Sale",
    beds: 3,
    baths: 4,
    area: "84.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1611095210561-67f0832b1ca3?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "similar-2",
    title: "Luxury condo near Chidlom BTS",
    location: "Pathum Wan, Bangkok",
    price: "THB 18,500,000",
    status: "Sale",
    beds: 2,
    baths: 2,
    area: "96.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "similar-3",
    title: "High floor residence with city view",
    location: "Sathorn, Bangkok",
    price: "THB 22,000,000",
    status: "Sale",
    beds: 3,
    baths: 3,
    area: "142.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    id: "similar-4",
    title: "Private family suite in Bangkok CBD",
    location: "Watthana, Bangkok",
    price: "THB 16,800,000",
    status: "Sale",
    beds: 3,
    baths: 3,
    area: "118.00 sqm",
    imageUrls: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
    ],
  },
];
