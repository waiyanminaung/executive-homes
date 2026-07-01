import { PrismaClient } from "../generated/prisma/client";
import { upsertSeedMediaImages } from "./mediaImages";

interface PricingTierSeed {
  label: string;
  salePrice?: number;
  rentPrice?: number;
}

interface PropertySeed {
  slug: string;
  title: string;
  description: string;
  isForSale?: boolean;
  isForRent?: boolean;
  salePrice?: number;
  rentPrice?: number;
  pricingTiers?: PricingTierSeed[];
  availabilityStatus?: "AVAILABLE" | "SOLD" | "RENTED";
  beds?: number;
  baths?: number;
  areaSqm: number;
  address: string;
  lat?: number;
  lng?: number;
  isFeatured: boolean;
  isPublished: boolean;
  isPetFriendly: boolean;
  propertyTypeSlug: string;
  provinceSlug: string;
  districtSlug: string;
  images?: string[];
  featureSlugs?: string[];
  transitStations?: { stationSlug: string; distanceMeters: number }[];
}

const PROPERTIES: PropertySeed[] = [
  {
    slug: "le-raffine-39-private-pool",
    transitStations: [
      { stationSlug: "e05", distanceMeters: 600 },
    ],
    title: "Le Raffine 39 — Private Pool 2BR",
    description:
      "Spacious 2-bedroom unit on a low floor facing East at Le Raffine 39. Features a private pool area, powder room, and storage room across 238 sqm. Fully furnished — furniture cannot be removed. A rare opportunity for refined living in the heart of Sukhumvit.",
    isForRent: true,
    rentPrice: 150000,
    beds: 2,
    baths: 2,
    areaSqm: 238,
    address: "Le Raffine 39, Sukhumvit Soi 39, Watthana, Bangkok 10110",
    lat: 13.7305,
    lng: 100.5706,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/f9e2df953dce4cfba04137c9d868f87e.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d979a17ca3ff4a4da0e03ff70fe13b33.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/3d07544c57664f498bf55d9ac34dcbfa.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/47e04d58eefa4f159873b8178113a306.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/200f5488bb2f4b648f0a703cef5e8403.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/2129a265229749c6978a37b106662e0a.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/4b870a61cdad402692747de728e8b780.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/eca6299e45d141e594e449b11fa291ab.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/12efd198369643cfbb8306ecb5f27021.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/f36ad9b268794fe48aa308ebe1564cd8.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/99c9a2eb32994a32b7b3f1bfca579bac.webp",
    ],
    featureSlugs: [
      "private-pool",
      "elevator",
      "parking",
      "concierge",
      "24hr-security",
      "cctv",
      "fitness-center",
      "swimming-pool",
    ],
  },
  {
    slug: "lake-avenue-condo-asoke",
    transitStations: [
      { stationSlug: "e04", distanceMeters: 350 },
      { stationSlug: "bl22", distanceMeters: 400 },
    ],
    title: "Lake Avenue Condo — 2BR High Floor Near Asoke",
    description:
      "Spacious 2-bedroom, 2-bathroom condo on the 21st floor at Lake Avenue, offering 123 sqm of comfortable living space. Steps from Sukhumvit MRT, Asoke BTS, Terminal 21, Emsphere, and Benjakitti Park. Transfer fee split 50/50 between buyer and seller.",
    isForSale: true,
    salePrice: 15000000,
    beds: 2,
    baths: 2,
    areaSqm: 123,
    address: "Lake Avenue, Sukhumvit, Khlong Toei, Bangkok 10110",
    lat: 13.7230,
    lng: 100.5606,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "khlong-toei",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/a972dec3aa264ffaa2991f2bcdee49d6.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/76e4872809924bfd93756d303be5f704.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/f77a0d60f6ef4ab58c6c8d7a48a70f9e.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/37897eb8a6a94b9fa2d4313b89433ba3.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8a295d0d804343f6b1c61695a7099523.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/077c4d29499640b38b974cc3ece5bf12.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d74413a5ec0244fd8279e19bde435b24.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/925145ddce5e4e07a3cddfdc370edee9.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/5e8e8005afa442c2a364ae2e38b3406e.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/df589857b42846b59914ee21b016eaf1.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d7fe5eb0bf2946b48fd8a92fa6d702bd.webp",
    ],
    featureSlugs: [
      "elevator",
      "parking",
      "swimming-pool",
      "fitness-center",
      "sauna",
      "meeting-room",
      "function-room",
      "playground",
    ],
  },
  {
    slug: "phrom-phong-duplex-private-pool-3br",
    transitStations: [
      { stationSlug: "e05", distanceMeters: 500 },
    ],
    title: "Duplex with Private Pool — 3BR Near BTS Phrom Phong",
    description:
      "Stunning 3-bedroom, 3.5-bathroom duplex with private pool across 380 sqm of open-plan living space. Unobstructed views, 5 minutes walk to BTS Phrom Phong, Em District, and Benjasiri Park.",
    isForRent: true,
    rentPrice: 200000,
    beds: 3,
    baths: 3,
    areaSqm: 380,
    address: "Khlong Tan Nuea, Watthana, Bangkok 10110",
    lat: 13.7295,
    lng: 100.5693,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8dfba0d716144fae89ab2a0adc5c76f6.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/63635387fe064cea90769b54dac4200d.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/79fd903b1d0b4b6d8bf6a853cd9e51ac.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/45f6eb13fd714f6b87c5c4dd787b741d.webp",
    ],
    featureSlugs: [
      "private-pool",
      "elevator",
      "parking",
      "concierge",
      "24hr-security",
      "cctv",
    ],
  },
  {
    slug: "grand-ville-house-1-sukhumvit-24",
    transitStations: [
      { stationSlug: "e04", distanceMeters: 700 },
      { stationSlug: "bl22", distanceMeters: 750 },
    ],
    title: "Grand Ville House 1 — 3BR Low Rise Condo Sukhumvit 24",
    description:
      "3-bedroom, 3-bathroom unit on floor 3 of Grand Ville House 1, a low-rise condo on Sukhumvit 24. 176 sqm of generous living space. Transfer fee split 50/50 between buyer and seller. Price negotiable.",
    isForSale: true,
    salePrice: 15000000,
    beds: 3,
    baths: 3,
    areaSqm: 176,
    address: "Grand Ville House 1, Sukhumvit Soi 24, Khlong Toei, Bangkok 10110",
    lat: 13.7228,
    lng: 100.5624,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "khlong-toei",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/783ab719c825477e98f483a23979ed69.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8e5c25bf4a874417a43b38ab285ca8a9.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/b8398fc5b78e45abbf7c6b5daad0e628.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/c5fb596ea536403ca89b01b6fdc0dfa8.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/7b34edcd9d944e008148b87a20a2984f.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/49783dd4447242959ed58b6baf5e4695.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d752285a91f24b0aa8217d7dffb34955.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/7d4c2ae846dc46fd9a4f48aefbf57afa.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/9dae1a5f34ca4d97bab952eae245a376.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/72ae9ca63d59442a8f4cdcb4949a00f7.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/7e3c21ab50e24a46ac40d6870eae0044.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/a7cfbb99ed54484faae6ead65a0bfaf0.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/cfb56975b4e04705acf7d4bc15c5e247.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/c13818e92f7c401e85f9be813f965b30.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/848c8484e1224f6c80ed808c21a039a3.webp",
    ],
    featureSlugs: [
      "elevator",
      "parking",
      "swimming-pool",
      "fitness-center",
      "sauna",
      "24hr-security",
    ],
  },
  {
    slug: "lumpini-ville-sukhumvit-77-tower1",
    transitStations: [
      { stationSlug: "e09", distanceMeters: 400 },
    ],
    title: "Lumpini Ville Sukhumvit 77 Tower 1 — 1BR Unblocked View",
    description:
      "Newly renovated 1-bedroom, 1-bathroom unit on floor 9 of Lumpini Ville Sukhumvit 77 Tower 1. 35 sqm with unblocked views. Transfer fee split 50/50. Price is for direct buyers only.",
    isForSale: true,
    salePrice: 2500000,
    beds: 1,
    baths: 1,
    areaSqm: 35,
    address: "Lumpini Ville Sukhumvit 77, Sukhumvit Soi 77, Suan Luang, Bangkok 10250",
    lat: 13.7152,
    lng: 100.6012,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "suan-luang",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/bb96ddb95c724d2db25a09bf5f55f77a.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/906746dd57d34715af8e71c435970744.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/da882dea4daf43ce9d2b361d606149d6.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/3cdb78088a9045209422cf034d36e3a6.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d5e51fcd381b4e689459c919fa4f39cf.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/08894aca432a4ef2a7a94a946973b573.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/de2ee518b7724f5d96696949f0a9f909.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/e7a66a73a6d942fd8e7d4d8630e24508.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/71d055b2bc874105b3bc6010ea9f2818.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/22881b2d99d341daa9df4674306304e8.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/75273c107c3540d583714493fcb6145a.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/61ce1679e51f4078bed92e7f35fb6de8.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/e16c9d89f67d4b72b7dcfe27cdcd95fe.webp",
    ],
    featureSlugs: [
      "elevator",
      "parking",
      "swimming-pool",
      "fitness-center",
    ],
  },
  {
    slug: "grand-ville-house-1-sukhumvit-24-unit-b",
    transitStations: [
      { stationSlug: "e04", distanceMeters: 700 },
      { stationSlug: "bl22", distanceMeters: 750 },
    ],
    title: "Grand Ville House 1 — 3BR Low Rise Condo Sukhumvit 24 (Unit B)",
    description:
      "3-bedroom, 3-bathroom unit on floor 3 of Grand Ville House 1, a low-rise condo on Sukhumvit 24. 176 sqm of generous living space. Transfer fee split 50/50 between buyer and seller.",
    isForSale: true,
    salePrice: 22000000,
    beds: 3,
    baths: 3,
    areaSqm: 176,
    address: "Grand Ville House 1, Sukhumvit Soi 24, Khlong Toei, Bangkok 10110",
    lat: 13.7228,
    lng: 100.5624,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "khlong-toei",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/781cbc353fcc489293182d815c5e24db.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/23da3095b9974f268139e55626bb3896.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/3a0dc5c71d0548f4bd9992bd27a7b2c5.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/44f4e327a9ac494083edfc7282eb6fb0.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/bb0ad1e7a41c4073828b0942819cad30.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/41c9f7130d9c435fb93f3f35d56997f1.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/4e69b85724264970ae0fe0081b5bdfa1.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/f659a7c7081b4c9cb86a2ff7617ae763.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/0e3e2b1338a54ddf84d67eb622f6f3cd.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/b3f0f7bb32824c0da85bc3eceef69f5f.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/a74e0f8f9bd04f169a8ba98fba717f0f.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/bd9459c4dafa43179644593b4848ab93.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8f95e94f5fa34e6cb8473ce07c338dc1.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/65dee40f2da047f8a061af9312064471.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/b43b7fb79b4641b8a0340e5dfb9dd6db.webp",
    ],
    featureSlugs: [
      "elevator",
      "parking",
      "swimming-pool",
      "fitness-center",
      "sauna",
      "24hr-security",
    ],
  },
  {
    slug: "le-raffine-sukhumvit-31-3br-private-pool",
    transitStations: [
      { stationSlug: "e05", distanceMeters: 450 },
    ],
    title: "Le Raffine Sukhumvit 31 — 3BR Private Pool High Floor",
    description:
      "Newly refurbished 3-bedroom, 3-bathroom unit on the 17th floor of Le Raffine Sukhumvit 31. 375 sqm with private pool, maid room, and powder room. Available unfurnished or fully furnished. Small dogs allowed. Currently rented until August 2026.",
    isForRent: true,
    availabilityStatus: "RENTED",
    pricingTiers: [
      { label: "Unfurnished", rentPrice: 150000 },
      { label: "Fully Furnished", rentPrice: 170000 },
    ],
    beds: 3,
    baths: 3,
    areaSqm: 375,
    address: "Le Raffine, Sukhumvit Soi 31, Watthana, Bangkok 10110",
    lat: 13.7315,
    lng: 100.5652,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: true,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/2f3c4cc86d46400abcfa9ce2f8f5268c.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/b61acdd4ab554675a4fa779b20a6b1de.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/dca9600a96494841a98f01ee35fc2552.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/df8ffa5e67074fc3b6a5f94679e9cc01.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/e7308e3493f84087a2cc067ac212988e.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8a46ce4bdff24066a2bc5f29fdd48fed.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/fc1fc763c8ce46f89e1f1d790687448a.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/a83c16b13c5b4b5eb614e2289ee4a494.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8d9ea8542f5c4a6e915dc87746071bfc.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/ce0ece4101ab46fe89dd80d448cc9232.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/36526dd9a52b4fdf840b5c127fd3d040.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/97160cf939f04868a1186c9ea7bf7f88.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/ea0b4a98de3046cf9d27a7071044e510.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/2441cb25d78845beac7a252569b113a7.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/611567e7ae61473dabd39ae9b1df4cdf.webp",
    ],
    featureSlugs: [
      "private-pool",
      "maid-room",
      "elevator",
      "parking",
      "concierge",
      "24hr-security",
      "cctv",
      "fitness-center",
      "swimming-pool",
    ],
  },
  {
    slug: "sukhumvit-soi-7-2br-maid-room-nana",
    transitStations: [
      { stationSlug: "e03", distanceMeters: 100 },
    ],
    title: "Spacious 2BR + Maid Room Steps from BTS Nana — Sukhumvit Soi 7",
    description:
      "2-bedroom, 2-bathroom condo with maid's bedroom across 166 sqm on Sukhumvit Soi 7. A 100-metre stroll to BTS Nana. Full amenities including swimming pool, tennis court, and 24-hour security.",
    isForRent: true,
    rentPrice: 67000,
    beds: 2,
    baths: 2,
    areaSqm: 166,
    address: "Sukhumvit Soi 7, Khlong Toei Nuea, Watthana, Bangkok 10110",
    lat: 13.7424,
    lng: 100.5554,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/1ae94bf71a1f4586abc31dd5f829dd02.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/6f203fa045cf452d9113bab80aabd68c.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/095bf17eea85434996a51633b2f6d88f.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/d0dadf90819e4e74b11c6f0888aa7383.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/b92423507a3444bf90ac9ad2e76fb310.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/c2068b595a7942e5a95453dcc92da304.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/cd1f0f33518d44ed957a001931f3ba95.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/7be411eac6a444c18e320ff2e9757bae.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/516a19790e8248d1a4c9a7fd327d219e.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/ee9c8baefb57416c938651a728934dbf.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/41235adbaf4d4f308de9ca45943c0347.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/dcb23b0b16564f1caee51f3aae61ad3f.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/7911a2a03ef443369365b02778fbb30f.webp",
    ],
    featureSlugs: [
      "swimming-pool",
      "elevator",
      "tennis-court",
      "parking",
      "24hr-security",
      "cctv",
      "maid-room",
    ],
  },
  {
    slug: "villa-asoke-2br-2parking-sale-rent",
    title: "Villa Asoke — 2BR 2Bath 2 Parking | 2 Min to MRT Asoke",
    description:
      "Floor 11 unit at Villa Asoke on Sukhumvit Soi 21. 2 bedrooms, 2 bathrooms with 2 dedicated parking spots. Two minutes walk to MRT Sukhumvit (Asoke). Available for sale at 11,800,000 THB or rent at 39,000 THB/month (minimum 1-year contract). Exceptional amenities including theater room, library, kids room, and more.",
    isForSale: true,
    isForRent: true,
    salePrice: 11800000,
    rentPrice: 39000,
    beds: 2,
    baths: 2,
    areaSqm: 0,
    address: "Villa Asoke, Sukhumvit Soi 21, Khlong Toei Nuea, Watthana, Bangkok 10110",
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/467b69edf1624edeaa217059f3b8ac9f.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/1c871e6030034368a0d8fd9262a35d93.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/c1b11c992cf5497290357e221eace198.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/0dfa5beb27f147df8bf2191fc49c85a5.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/39a44dfc12484ad7ab4c952eef97f147.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/41a83045bde24fdcaeda5d1e31495e85.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/89f52c9b070644df8417e70e4639e96c.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/2e8d664a37774ed2ba50eb435067e86b.webp",
    ],
    transitStations: [
      { stationSlug: "bl22", distanceMeters: 200 },
      { stationSlug: "e04", distanceMeters: 250 },
    ],
    featureSlugs: [
      "elevator",
      "parking",
      "swimming-pool",
      "fitness-center",
      "sauna",
      "kids-room",
      "theater-room",
      "library-room",
      "function-room",
    ],
  },
  {
    slug: "ideo-mobi-sukhumvit-40-1br-rent",
    title: "Ideo Mobi Sukhumvit 40 — 1BR East Facing Fully Furnished Floor 6",
    description:
      "1-bedroom 1-bathroom unit on floor 6 at Ideo Mobi Sukhumvit 40. East-facing fully furnished. Features 2 outdoor swimming pools, EV charger, and shuttle service.",
    isForRent: true,
    rentPrice: 24000,
    beds: 1,
    baths: 1,
    areaSqm: 0,
    address: "Ideo Mobi Sukhumvit 40, Sukhumvit Soi 40, Khlong Toei, Bangkok 10110",
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "khlong-toei",
    images: [
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/a482af5e63d046bdb42c3ca0d48c9de9.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/cc7d7a68e78a4ac38af241e3e2a2cf0c.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/b1775ee9a8d54ae8a5567fa69e60922a.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/9f4c0fe8737c4d1c817fd65fc43d104a.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/7c80fb35e09d4c58b807d2152161029b.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/da4b0d3f70484ff28525908d74ba90d4.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/a5cfc22a8fb1463abc4b52ef1e666d22.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/4c0c861e065f4956833884a96e614e13.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/e2c81970c41f455b9238eebc4df25f17.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/ad8e648d97ae41ce858c1e3d775e0cb5.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/da5d8f4307444ccd9772dd37553db1dc.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/3dcfbda226ab489fb47b0a34f9558413.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8c09414f988b4c72b598760a4e4dbb66.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/9eeac3277a434a0598d5612cdae8079c.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/afad71b897ca44c6b11d36edb9a87d4d.webp",
      "https://pub-8f9f9a2373074f6eac2e7c27752fbb2b.r2.dev/media/8666de357fe344fda1d79b718ff29deb.webp",
    ],
    transitStations: [
      { stationSlug: "e06", distanceMeters: 600 },
    ],
    featureSlugs: [
      "elevator",
      "parking",
      "ev-charger",
      "swimming-pool",
      "fitness-center",
      "shuttle-service",
    ],
  },
];

export async function seedProperties(prisma: PrismaClient) {
  console.log("Seeding properties...");

  const bangkok = await prisma.province.findFirst({ where: { slug: "bangkok" } });

  if (!bangkok) {
    console.log("Bangkok province not found, skipping properties seed.");
    return;
  }

  for (const p of PROPERTIES) {
    const propertyType = await prisma.propertyType.findFirst({
      where: { slug: p.propertyTypeSlug },
    });

    if (!propertyType) continue;

    const district = await prisma.district.findFirst({
      where: { slug: p.districtSlug, provinceId: bangkok.id },
    });

    const existing = await prisma.property.findUnique({ where: { slug: p.slug } });

    if (existing) continue;

    const featureIds = p.featureSlugs
      ? await prisma.feature
          .findMany({ where: { slug: { in: p.featureSlugs } }, select: { id: true } })
          .then((fs) => fs.map((f) => f.id))
      : [];

    const stationEntries = p.transitStations
      ? await Promise.all(
          p.transitStations.map(async (ts) => {
            const station = await prisma.transitStation.findUnique({ where: { slug: ts.stationSlug } });
            return station ? { stationId: station.id, distanceMeters: ts.distanceMeters } : null;
          }),
        ).then((entries) => entries.filter((e): e is { stationId: string; distanceMeters: number } => e !== null))
      : [];

    const mediaImages = p.images ? await upsertSeedMediaImages(prisma, p.images) : [];

    await prisma.property.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        propertyTypeId: propertyType.id,
        isForSale: p.isForSale ?? false,
        isForRent: p.isForRent ?? false,
        beds: p.beds,
        baths: p.baths,
        areaSqm: p.areaSqm,
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        isPetFriendly: p.isPetFriendly,
        provinceId: bangkok.id,
        districtId: district?.id,
        availabilityStatus: p.availabilityStatus ?? "AVAILABLE",
        pricingTiers: {
          create: p.pricingTiers
            ? p.pricingTiers.map((t, order) => ({ label: t.label, salePrice: t.salePrice ?? null, rentPrice: t.rentPrice ?? null, order }))
            : [{ label: "Standard", salePrice: p.salePrice ?? null, rentPrice: p.rentPrice ?? null, order: 0 }],
        },
        images: mediaImages.length
          ? { create: mediaImages.map((mi, order) => ({ mediaImageId: mi.id, order })) }
          : undefined,
        features: featureIds.length
          ? { create: featureIds.map((featureId) => ({ featureId })) }
          : undefined,
        transitStations: stationEntries.length
          ? { create: stationEntries }
          : undefined,
      },
    });
  }

  console.log("Properties seeded.");
}
