import { PrismaClient } from "../generated/prisma/client";

const PROVINCES = [
  { name: "Bangkok", slug: "bangkok" },
];

const BANGKOK_DISTRICTS = [
  { name: "Bang Bon", slug: "bang-bon" },
  { name: "Bang Kapi", slug: "bang-kapi" },
  { name: "Bang Khae", slug: "bang-khae" },
  { name: "Bang Khen", slug: "bang-khen" },
  { name: "Bang Kho Laem", slug: "bang-kho-laem" },
  { name: "Bang Khun Thian", slug: "bang-khun-thian" },
  { name: "Bang Na", slug: "bang-na" },
  { name: "Bang Phlat", slug: "bang-phlat" },
  { name: "Bang Rak", slug: "bang-rak" },
  { name: "Bang Sue", slug: "bang-sue" },
  { name: "Bangkok Noi", slug: "bangkok-noi" },
  { name: "Bangkok Yai", slug: "bangkok-yai" },
  { name: "Bueng Kum", slug: "bueng-kum" },
  { name: "Chatuchak", slug: "chatuchak" },
  { name: "Chom Thong", slug: "chom-thong" },
  { name: "Din Daeng", slug: "din-daeng" },
  { name: "Don Mueang", slug: "don-mueang" },
  { name: "Dusit", slug: "dusit" },
  { name: "Huai Khwang", slug: "huai-khwang" },
  { name: "Khan Na Yao", slug: "khan-na-yao" },
  { name: "Khlong Sam Wa", slug: "khlong-sam-wa" },
  { name: "Khlong San", slug: "khlong-san" },
  { name: "Khlong Toei", slug: "khlong-toei" },
  { name: "Lak Si", slug: "lak-si" },
  { name: "Lat Krabang", slug: "lat-krabang" },
  { name: "Lat Phrao", slug: "lat-phrao" },
  { name: "Min Buri", slug: "min-buri" },
  { name: "Nong Chok", slug: "nong-chok" },
  { name: "Nong Khaem", slug: "nong-khaem" },
  { name: "Pathum Wan", slug: "pathum-wan" },
  { name: "Phaya Thai", slug: "phaya-thai" },
  { name: "Phra Khanong", slug: "phra-khanong" },
  { name: "Phra Nakhon", slug: "phra-nakhon" },
  { name: "Prawet", slug: "prawet" },
  { name: "Pom Prap Sattru Phai", slug: "pom-prap-sattru-phai" },
  { name: "Rat Burana", slug: "rat-burana" },
  { name: "Ratchathewi", slug: "ratchathewi" },
  { name: "Sai Mai", slug: "sai-mai" },
  { name: "Samphanthawong", slug: "samphanthawong" },
  { name: "Saphan Sung", slug: "saphan-sung" },
  { name: "Sathon", slug: "sathon" },
  { name: "Suan Luang", slug: "suan-luang" },
  { name: "Taling Chan", slug: "taling-chan" },
  { name: "Thawi Watthana", slug: "thawi-watthana" },
  { name: "Thon Buri", slug: "thon-buri" },
  { name: "Thung Khru", slug: "thung-khru" },
  { name: "Wang Thonglang", slug: "wang-thonglang" },
  { name: "Watthana", slug: "watthana" },
  { name: "Yan Nawa", slug: "yan-nawa" },
];

const BANGKOK_SUBDISTRICTS: Record<string, { name: string; slug: string }[]> = {
  "bang-bon": [
    { name: "Bang Bon Nuea", slug: "bang-bon-nuea" },
    { name: "Bang Bon Tai", slug: "bang-bon-tai" },
    { name: "Khlong Bang Bon", slug: "khlong-bang-bon" },
    { name: "Khlong Bang Phran", slug: "khlong-bang-phran" },
  ],
  "bang-kapi": [
    { name: "Khlong Chan", slug: "khlong-chan" },
    { name: "Hua Mak", slug: "hua-mak" },
  ],
  "bang-khae": [
    { name: "Bang Khae", slug: "bang-khae" },
    { name: "Bang Khae Nuea", slug: "bang-khae-nuea" },
    { name: "Bang Phai", slug: "bang-phai" },
    { name: "Lak Song", slug: "lak-song" },
  ],
  "bang-khen": [
    { name: "Anusawari", slug: "anusawari" },
    { name: "Tha Raeng", slug: "tha-raeng" },
  ],
  "bang-kho-laem": [
    { name: "Bang Kho Laem", slug: "bang-kho-laem" },
    { name: "Bang Khlo", slug: "bang-khlo" },
    { name: "Wat Phraya Krai", slug: "wat-phraya-krai" },
  ],
  "bang-khun-thian": [
    { name: "Tha Kham", slug: "tha-kham" },
    { name: "Samae Dam", slug: "samae-dam" },
  ],
  "bang-na": [
    { name: "Bang Na Nuea", slug: "bang-na-nuea" },
    { name: "Bang Na Tai", slug: "bang-na-tai" },
  ],
  "bang-phlat": [
    { name: "Bang Phlat", slug: "bang-phlat" },
    { name: "Bang Bamru", slug: "bang-bamru" },
    { name: "Bang O", slug: "bang-o" },
    { name: "Bang Yi Khan", slug: "bang-yi-khan" },
  ],
  "bang-rak": [
    { name: "Bang Rak", slug: "bang-rak" },
    { name: "Maha Phruttharam", slug: "maha-phruttharam" },
    { name: "Si Phraya", slug: "si-phraya" },
    { name: "Suriyawong", slug: "suriyawong" },
    { name: "Silom", slug: "silom" },
  ],
  "bang-sue": [
    { name: "Bang Sue", slug: "bang-sue" },
    { name: "Wongsawang", slug: "wongsawang" },
  ],
  "bangkok-noi": [
    { name: "Siri Rat", slug: "siri-rat" },
    { name: "Ban Chang Lo", slug: "ban-chang-lo" },
    { name: "Bang Khun Non", slug: "bang-khun-non" },
    { name: "Bang Khun Si", slug: "bang-khun-si" },
    { name: "Arun Amarin", slug: "arun-amarin" },
  ],
  "bangkok-yai": [
    { name: "Wat Tha Phra", slug: "wat-tha-phra" },
    { name: "Wat Arun", slug: "wat-arun" },
  ],
  "bueng-kum": [
    { name: "Khlong Kum", slug: "khlong-kum" },
    { name: "Nawamin", slug: "nawamin" },
    { name: "Nuan Chan", slug: "nuan-chan" },
  ],
  "chatuchak": [
    { name: "Chatuchak", slug: "chatuchak" },
    { name: "Chom Phon", slug: "chom-phon" },
    { name: "Chantharakasem", slug: "chantharakasem" },
    { name: "Lat Yao", slug: "lat-yao" },
    { name: "Sena Nikhom", slug: "sena-nikhom" },
  ],
  "chom-thong": [
    { name: "Bang Khun Thian", slug: "bang-khun-thian" },
    { name: "Bang Kho", slug: "bang-kho" },
    { name: "Bang Mot", slug: "bang-mot" },
    { name: "Chom Thong", slug: "chom-thong" },
  ],
  "din-daeng": [
    { name: "Din Daeng", slug: "din-daeng" },
    { name: "Ratchadaphisek", slug: "ratchadaphisek" },
  ],
  "don-mueang": [
    { name: "Don Mueang", slug: "don-mueang" },
    { name: "Sanambin", slug: "sanambin" },
    { name: "Si Kan", slug: "si-kan" },
  ],
  "dusit": [
    { name: "Dusit", slug: "dusit" },
    { name: "Wachira Phayaban", slug: "wachira-phayaban" },
    { name: "Suan Chitlada", slug: "suan-chitlada" },
    { name: "Si Yan", slug: "si-yan" },
    { name: "Thanon Nakhon Chai Si", slug: "thanon-nakhon-chai-si" },
  ],
  "huai-khwang": [
    { name: "Huai Khwang", slug: "huai-khwang" },
    { name: "Bang Kapi", slug: "bang-kapi" },
    { name: "Sam Sen Nok", slug: "sam-sen-nok" },
  ],
  "khan-na-yao": [
    { name: "Khan Na Yao", slug: "khan-na-yao" },
    { name: "Ram Inthra", slug: "ram-inthra" },
  ],
  "khlong-sam-wa": [
    { name: "Sam Wa Tawan Tok", slug: "sam-wa-tawan-tok" },
    { name: "Sam Wa Tawan Ok", slug: "sam-wa-tawan-ok" },
    { name: "Bang Chan", slug: "bang-chan" },
    { name: "Sai Kong Din", slug: "sai-kong-din" },
    { name: "Sai Kong Din Tai", slug: "sai-kong-din-tai" },
  ],
  "khlong-san": [
    { name: "Khlong San", slug: "khlong-san" },
    { name: "Somdet Chao Phraya", slug: "somdet-chao-phraya" },
    { name: "Bang Lamphu Lang", slug: "bang-lamphu-lang" },
    { name: "Khlong Ton Sai", slug: "khlong-ton-sai" },
  ],
  "khlong-toei": [
    { name: "Khlong Toei", slug: "khlong-toei" },
    { name: "Khlong Tan", slug: "khlong-tan" },
    { name: "Phra Khanong", slug: "phra-khanong" },
  ],
  "lak-si": [
    { name: "Thung Song Hong", slug: "thung-song-hong" },
    { name: "Talat Bang Khen", slug: "talat-bang-khen" },
  ],
  "lat-krabang": [
    { name: "Lat Krabang", slug: "lat-krabang" },
    { name: "Khlong Song Ton Nun", slug: "khlong-song-ton-nun" },
    { name: "Khlong Sam Pravet", slug: "khlong-sam-pravet" },
    { name: "Lam Pla Thio", slug: "lam-pla-thio" },
    { name: "Thap Yao", slug: "thap-yao" },
    { name: "Khun Thian", slug: "khun-thian" },
  ],
  "lat-phrao": [
    { name: "Lat Phrao", slug: "lat-phrao" },
    { name: "Chorakhe Bua", slug: "chorakhe-bua" },
  ],
  "min-buri": [
    { name: "Min Buri", slug: "min-buri" },
    { name: "Saen Saep", slug: "saen-saep" },
  ],
  "nong-chok": [
    { name: "Nong Chok", slug: "nong-chok" },
    { name: "Krathum Rai", slug: "krathum-rai" },
    { name: "Khlong Sip", slug: "khlong-sip" },
    { name: "Khlong Sip Song", slug: "khlong-sip-song" },
    { name: "Khok Faek", slug: "khok-faek" },
    { name: "Khu Fang Nuea", slug: "khu-fang-nuea" },
    { name: "Lam Phak Chi", slug: "lam-phak-chi" },
    { name: "Lam Toiting", slug: "lam-toiting" },
  ],
  "nong-khaem": [
    { name: "Nong Khaem", slug: "nong-khaem" },
    { name: "Nong Khang Phlu", slug: "nong-khang-phlu" },
  ],
  "pathum-wan": [
    { name: "Rong Mueang", slug: "rong-mueang" },
    { name: "Wang Mai", slug: "wang-mai" },
    { name: "Pathum Wan", slug: "pathum-wan" },
    { name: "Lumpini", slug: "lumpini" },
  ],
  "phaya-thai": [
    { name: "Sam Sen Nai", slug: "sam-sen-nai" },
    { name: "Phaya Thai", slug: "phaya-thai" },
  ],
  "phra-khanong": [
    { name: "Bang Chak", slug: "bang-chak" },
    { name: "Phra Khanong Tai", slug: "phra-khanong-tai" },
  ],
  "phra-nakhon": [
    { name: "Phra Borom Maha Ratchawang", slug: "phra-borom-maha-ratchawang" },
    { name: "Wang Burapha Phirom", slug: "wang-burapha-phirom" },
    { name: "Wat Ratchabophit", slug: "wat-ratchabophit" },
    { name: "Samran Rat", slug: "samran-rat" },
    { name: "San Chao Pho Suea", slug: "san-chao-pho-suea" },
    { name: "Sao Chingcha", slug: "sao-chingcha" },
    { name: "Bowon Niwet", slug: "bowon-niwet" },
    { name: "Talat Yot", slug: "talat-yot" },
    { name: "Chana Songkhram", slug: "chana-songkhram" },
    { name: "Ban Phan Thom", slug: "ban-phan-thom" },
    { name: "Bang Khun Phrom", slug: "bang-khun-phrom" },
    { name: "Wat Sam Phraya", slug: "wat-sam-phraya" },
  ],
  "prawet": [
    { name: "Prawet", slug: "prawet" },
    { name: "Nong Bon", slug: "nong-bon" },
    { name: "Dokmai", slug: "dokmai" },
  ],
  "pom-prap-sattru-phai": [
    { name: "Pom Prap", slug: "pom-prap" },
    { name: "Wat Thepsirin", slug: "wat-thepsirin" },
    { name: "Khlong Mahanak", slug: "khlong-mahanak" },
    { name: "Ban Bat", slug: "ban-bat" },
    { name: "Wat Sommanat", slug: "wat-sommanat" },
  ],
  "rat-burana": [
    { name: "Rat Burana", slug: "rat-burana" },
    { name: "Bang Pakok", slug: "bang-pakok" },
  ],
  "ratchathewi": [
    { name: "Thung Phaya Thai", slug: "thung-phaya-thai" },
    { name: "Thanon Phaya Thai", slug: "thanon-phaya-thai" },
    { name: "Makkasan", slug: "makkasan" },
    { name: "Thanon Phetchaburi", slug: "thanon-phetchaburi" },
  ],
  "sai-mai": [
    { name: "Sai Mai", slug: "sai-mai" },
    { name: "O Ngoen", slug: "o-ngoen" },
    { name: "Khlong Thanon", slug: "khlong-thanon" },
  ],
  "samphanthawong": [
    { name: "Chakrawat", slug: "chakrawat" },
    { name: "Samphanthawong", slug: "samphanthawong" },
    { name: "Talat Noi", slug: "talat-noi" },
  ],
  "saphan-sung": [
    { name: "Saphan Sung", slug: "saphan-sung" },
    { name: "Rat Phatthana", slug: "rat-phatthana" },
    { name: "Thap Chang", slug: "thap-chang" },
  ],
  "sathon": [
    { name: "Thung Wat Don", slug: "thung-wat-don" },
    { name: "Yannawa", slug: "yannawa" },
    { name: "Thung Maha Mek", slug: "thung-maha-mek" },
  ],
  "suan-luang": [
    { name: "Suan Luang", slug: "suan-luang" },
    { name: "On Nut", slug: "on-nut" },
    { name: "Phatthanakan", slug: "phatthanakan" },
  ],
  "taling-chan": [
    { name: "Taling Chan", slug: "taling-chan" },
    { name: "Khlong Chak Phra", slug: "khlong-chak-phra" },
    { name: "Chimakli", slug: "chimakli" },
    { name: "Bang Phrom", slug: "bang-phrom" },
    { name: "Bang Ramat", slug: "bang-ramat" },
    { name: "Bang Chueak Nang", slug: "bang-chueak-nang" },
  ],
  "thawi-watthana": [
    { name: "Thawi Watthana", slug: "thawi-watthana" },
    { name: "Sala Thammasop", slug: "sala-thammasop" },
  ],
  "thon-buri": [
    { name: "Wat Kanlaya", slug: "wat-kanlaya" },
    { name: "Hiran Ruchi", slug: "hiran-ruchi" },
    { name: "Bang Yi Ruea", slug: "bang-yi-ruea" },
    { name: "Bukkhalo", slug: "bukkhalo" },
    { name: "Talat Phlu", slug: "talat-phlu" },
    { name: "Dao Khanong", slug: "dao-khanong" },
    { name: "Samre", slug: "samre" },
  ],
  "thung-khru": [
    { name: "Thung Khru", slug: "thung-khru" },
    { name: "Bang Mot", slug: "bang-mot" },
  ],
  "wang-thonglang": [
    { name: "Wang Thonglang", slug: "wang-thonglang" },
    { name: "Saphan Song", slug: "saphan-song" },
    { name: "Khlong Chaokhun Sing", slug: "khlong-chaokhun-sing" },
    { name: "Plubpla", slug: "plubpla" },
  ],
  "watthana": [
    { name: "Khlong Toei Nuea", slug: "khlong-toei-nuea" },
    { name: "Khlong Tan Nuea", slug: "khlong-tan-nuea" },
    { name: "Phra Khanong Nuea", slug: "phra-khanong-nuea" },
  ],
  "yan-nawa": [
    { name: "Chong Nonsi", slug: "chong-nonsi" },
    { name: "Bang Phongphang", slug: "bang-phongphang" },
  ],
};

export async function seedProvinces(prisma: PrismaClient) {
  console.log("Seeding provinces...");

  const bangkok = await prisma.province.upsert({
    where: { slug: "bangkok" },
    update: {},
    create: { name: "Bangkok", slug: "bangkok" },
  });

  for (const p of PROVINCES.filter((pr) => pr.slug !== "bangkok")) {
    await prisma.province.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log("Seeding Bangkok districts...");

  for (const d of BANGKOK_DISTRICTS) {
    const district = await prisma.district.upsert({
      where: { slug_provinceId: { slug: d.slug, provinceId: bangkok.id } },
      update: {},
      create: { ...d, provinceId: bangkok.id },
    });

    const subdistricts = BANGKOK_SUBDISTRICTS[d.slug] ?? [];

    for (const s of subdistricts) {
      await prisma.subDistrict.upsert({
        where: { slug_districtId: { slug: s.slug, districtId: district.id } },
        update: {},
        create: { ...s, districtId: district.id },
      });
    }
  }

  console.log("Seeding Bangkok subdistricts done.");
}
