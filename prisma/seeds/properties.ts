import { PrismaClient } from "../generated/prisma/client";

const PROPERTIES = [
  {
    slug: "the-grand-residence-sukhumvit",
    title: "The Grand Residence Sukhumvit",
    description:
      "Luxurious 3-bedroom condo in the heart of Sukhumvit. Floor-to-ceiling windows with panoramic city views, modern kitchen, and premium finishes throughout.",
    isForSale: true,
    isForRent: true,
    salePrice: 15000000,
    rentPrice: 65000,
    beds: 3,
    baths: 2,
    areaSqm: 120,
    address: "123 Sukhumvit Road, Watthana, Bangkok 10110",
    lat: 13.7298,
    lng: 100.5692,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
  },
  {
    slug: "silom-executive-suite",
    title: "Silom Executive Suite",
    description:
      "Premium 2-bedroom apartment steps from BTS Sala Daeng. Fully furnished with high-end appliances, infinity pool, and 24-hour concierge service.",
    isForRent: true,
    rentPrice: 45000,
    beds: 2,
    baths: 2,
    areaSqm: 85,
    address: "45 Silom Road, Bang Rak, Bangkok 10500",
    lat: 13.7266,
    lng: 100.5249,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: true,
    propertyTypeSlug: "apartment",
    provinceSlug: "bangkok",
    districtSlug: "bang-rak",
  },
  {
    slug: "sathorn-luxury-penthouse",
    title: "Sathorn Luxury Penthouse",
    description:
      "Exclusive penthouse on the 40th floor with 360-degree views of Bangkok skyline. Private rooftop terrace, 4 bedrooms, private lift access.",
    isForSale: true,
    salePrice: 45000000,
    beds: 4,
    baths: 4,
    areaSqm: 280,
    address: "88 Sathorn Road, Sathon, Bangkok 10120",
    lat: 13.7234,
    lng: 100.5285,
    isFeatured: true,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "penthouse",
    provinceSlug: "bangkok",
    districtSlug: "sathon",
  },
  {
    slug: "thonglang-family-villa",
    title: "Thonglang Family Villa",
    description:
      "Spacious 4-bedroom private villa with garden, private pool, and maid quarters. Perfect for families seeking privacy and comfort in central Bangkok.",
    isForSale: true,
    isForRent: true,
    salePrice: 28000000,
    rentPrice: 120000,
    beds: 4,
    baths: 3,
    areaSqm: 350,
    address: "12 Soi Ladprao 15, Wang Thonglang, Bangkok 10310",
    lat: 13.7677,
    lng: 100.5936,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: true,
    propertyTypeSlug: "villa",
    provinceSlug: "bangkok",
    districtSlug: "wang-thonglang",
  },
  {
    slug: "phrom-phong-studio-condo",
    title: "Phrom Phong Studio Condo",
    description:
      "Cozy studio condo 200m from BTS Phrom Phong. Fully furnished, modern design, access to gym and rooftop pool. Ideal for young professionals.",
    isForRent: true,
    rentPrice: 18000,
    beds: 1,
    baths: 1,
    areaSqm: 35,
    address: "Sukhumvit 39, Watthana, Bangkok 10110",
    lat: 13.7285,
    lng: 100.5701,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: false,
    propertyTypeSlug: "condo",
    provinceSlug: "bangkok",
    districtSlug: "watthana",
  },
  {
    slug: "ari-townhouse-with-garden",
    title: "Ari Townhouse with Garden",
    description:
      "Modern 3-storey townhouse in the trendy Ari neighborhood. Private garden, rooftop deck, open-plan living. Walking distance to BTS Ari.",
    isForSale: true,
    isForRent: true,
    salePrice: 12000000,
    rentPrice: 55000,
    beds: 3,
    baths: 3,
    areaSqm: 200,
    address: "Soi Ari 4, Phaya Thai, Bangkok 10400",
    lat: 13.7756,
    lng: 100.5475,
    isFeatured: false,
    isPublished: true,
    isPetFriendly: true,
    propertyTypeSlug: "townhouse",
    provinceSlug: "bangkok",
    districtSlug: "phaya-thai",
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

    await prisma.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
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
        pricingTiers: {
          create: [
            {
              label: "Standard",
              salePrice: p.salePrice ?? null,
              rentPrice: p.rentPrice ?? null,
              order: 0,
            },
          ],
        },
      },
    });
  }

  console.log("Properties seeded.");
}
