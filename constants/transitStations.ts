export const TRANSIT_LINES = [
  "BTS_SUKHUMVIT",
  "BTS_SILOM",
  "BTS_GOLD",
  "MRT_BLUE",
  "MRT_PURPLE",
  "MRT_YELLOW",
  "MRT_PINK",
  "ARL",
  "SRT_RED",
  "BRT",
] as const;

export type TransitLine = (typeof TRANSIT_LINES)[number];

export const TRANSIT_LINE_LABELS: Record<TransitLine, string> = {
  BTS_SUKHUMVIT: "BTS Sukhumvit Line",
  BTS_SILOM: "BTS Silom Line",
  BTS_GOLD: "BTS Gold Line",
  MRT_BLUE: "MRT Blue Line",
  MRT_PURPLE: "MRT Purple Line",
  MRT_YELLOW: "MRT Yellow Line",
  MRT_PINK: "MRT Pink Line",
  ARL: "Airport Rail Link",
  SRT_RED: "SRT Red Line",
  BRT: "BRT",
};

export const TRANSIT_LINE_COLORS: Record<TransitLine, string> = {
  BTS_SUKHUMVIT: "#63B140",
  BTS_SILOM: "#006450",
  BTS_GOLD: "#D4AF37",
  MRT_BLUE: "#193175",
  MRT_PURPLE: "#712D92",
  MRT_YELLOW: "#F9DF00",
  MRT_PINK: "#F1A5C2",
  ARL: "#982639",
  SRT_RED: "#901414",
  BRT: "#FF6B35",
};

