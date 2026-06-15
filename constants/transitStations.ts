export const TRANSIT_LINES = [
  "BTS_SUKHUMVIT",
  "BTS_SILOM",
  "MRT_BLUE",
  "MRT_PURPLE",
  "ARL",
  "BRT",
] as const;

export type TransitLine = (typeof TRANSIT_LINES)[number];

export const TRANSIT_LINE_LABELS: Record<TransitLine, string> = {
  BTS_SUKHUMVIT: "BTS Sukhumvit",
  BTS_SILOM: "BTS Silom",
  MRT_BLUE: "MRT Blue",
  MRT_PURPLE: "MRT Purple",
  ARL: "Airport Rail Link",
  BRT: "BRT",
};

export const TRANSIT_STATION_PRESETS: { name: string; slug: string; line: TransitLine }[] = [
  { name: "Asok", slug: "asok", line: "BTS_SUKHUMVIT" },
  { name: "Nana", slug: "nana", line: "BTS_SUKHUMVIT" },
  { name: "Phrom Phong", slug: "phrom-phong", line: "BTS_SUKHUMVIT" },
  { name: "Thong Lo", slug: "thong-lo", line: "BTS_SUKHUMVIT" },
  { name: "Ekkamai", slug: "ekkamai", line: "BTS_SUKHUMVIT" },
  { name: "Phra Khanong", slug: "phra-khanong", line: "BTS_SUKHUMVIT" },
  { name: "On Nut", slug: "on-nut", line: "BTS_SUKHUMVIT" },
  { name: "Udom Suk", slug: "udom-suk", line: "BTS_SUKHUMVIT" },
  { name: "Bang Na", slug: "bang-na", line: "BTS_SUKHUMVIT" },
  { name: "Ari", slug: "ari", line: "BTS_SUKHUMVIT" },
  { name: "Saphan Khwai", slug: "saphan-khwai", line: "BTS_SUKHUMVIT" },
  { name: "Mo Chit", slug: "mo-chit", line: "BTS_SUKHUMVIT" },
  { name: "Ha Yaek Lat Phrao", slug: "ha-yaek-lat-phrao", line: "BTS_SUKHUMVIT" },
  { name: "Chatuchak Park", slug: "chatuchak-park", line: "BTS_SUKHUMVIT" },
  { name: "Sala Daeng", slug: "sala-daeng", line: "BTS_SILOM" },
  { name: "Surasak", slug: "surasak", line: "BTS_SILOM" },
  { name: "Saphan Taksin", slug: "saphan-taksin", line: "BTS_SILOM" },
  { name: "Krung Thon Buri", slug: "krung-thon-buri", line: "BTS_SILOM" },
  { name: "Sukhumvit (MRT)", slug: "sukhumvit-mrt", line: "MRT_BLUE" },
  { name: "Queen Sirikit", slug: "queen-sirikit", line: "MRT_BLUE" },
  { name: "Khlong Toei (MRT)", slug: "khlong-toei-mrt", line: "MRT_BLUE" },
  { name: "Si Lom (MRT)", slug: "si-lom-mrt", line: "MRT_BLUE" },
  { name: "Lumphini", slug: "lumphini", line: "MRT_BLUE" },
  { name: "Sam Yan", slug: "sam-yan", line: "MRT_BLUE" },
  { name: "Phra Ram 9", slug: "phra-ram-9", line: "MRT_BLUE" },
  { name: "Thailand Cultural Centre", slug: "thailand-cultural-centre", line: "MRT_BLUE" },
  { name: "Huai Khwang (MRT)", slug: "huai-khwang-mrt", line: "MRT_BLUE" },
  { name: "Ratchadaphisek", slug: "ratchadaphisek", line: "MRT_BLUE" },
];
