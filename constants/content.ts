import type { Category, Content, DownloadLink } from "@/types/content";

export const PAGE_SIZE = 18;

export const WATCHLIST_STORAGE_KEY = "pkmovie.watchlist";

export const CATEGORIES: Category[] = [
  { id: "action", name: "အက်ရှင်", orderIndex: 1 },
  { id: "drama", name: "ဒရာမာ", orderIndex: 2 },
  { id: "romance", name: "ချစ်ကား", orderIndex: 3 },
  { id: "sci-fi", name: "အာကာသ", orderIndex: 4 },
  { id: "horror", name: "သရဲ", orderIndex: 5 },
  { id: "family", name: "မိသားစု", orderIndex: 6 },
];

const DEFAULT_DOWNLOADS: DownloadLink[] = [
  {
    quality: "1080p",
    size: "2.4 GB",
    url: "https://example.com/download/1080",
  },
  { quality: "720p", size: "1.4 GB", url: "https://example.com/download/720" },
  { quality: "480p", size: "700 MB", url: "https://example.com/download/480" },
];

const SERIES_DOWNLOADS: DownloadLink[] = [
  { quality: "1080p", size: "1.2 GB", url: "https://example.com/series/1080" },
  { quality: "720p", size: "780 MB", url: "https://example.com/series/720" },
];

export const CONTENT: Content[] = [
  {
    id: "m-echo",
    type: "movie",
    title: "Echoes of Yangon",
    year: 2024,
    rating: 8.2,
    duration: "2h 12m",
    genre: ["Action", "Drama"],
    description:
      "မြို့တော်ရဲ့ အပြင်းအထန်ညတွေထဲမှာ တစ်ယောက်တည်း ဘဝကို ကာကွယ်ဖို့ လမ်းကြောင်းအသစ်တစ်ခုပေါ်လာသည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    downloadLinks: DEFAULT_DOWNLOADS,
    categoryIds: ["action", "drama"],
    isTrending: true,
  },
  {
    id: "m-saffron",
    type: "movie",
    title: "Saffron Skies",
    year: 2023,
    rating: 7.9,
    duration: "1h 48m",
    genre: ["Romance", "Drama"],
    description:
      "အလင်းနဲ့ အမှောင်ကြားမှာ ချစ်ခြင်းတရားက အထွေထွေကို ပြောင်းလဲပေးနိုင်သလား။",
    posterUrl:
      "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    downloadLinks: DEFAULT_DOWNLOADS,
    categoryIds: ["romance", "drama"],
    isPopular: true,
  },
  {
    id: "m-shadow",
    type: "movie",
    title: "Shadow Market",
    year: 2022,
    rating: 7.4,
    duration: "2h 03m",
    genre: ["Action", "Thriller"],
    description:
      "အမှောင်ဈေးကွက်ကို အရင်းစိုက်စုံစမ်းရင်း အရေးကြီးဆုံး အချက်အလက်တစ်ခု ထွက်ပေါ်လာသည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    downloadLinks: DEFAULT_DOWNLOADS,
    categoryIds: ["action"],
  },
  {
    id: "m-ember",
    type: "movie",
    title: "Ember Lake",
    year: 2021,
    rating: 7.1,
    duration: "1h 56m",
    genre: ["Horror", "Mystery"],
    description:
      "အကြောင်းမသိတဲ့ အဖြစ်အပျက်တွေကြားက ရေကန်အတိတ်အကြောင်းကို ဖော်ထုတ်ရင်း မမျှော်လင့်တဲ့အဆုံးသတ်ကို တွေ့မည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    downloadLinks: DEFAULT_DOWNLOADS,
    categoryIds: ["horror"],
  },
  {
    id: "s-aurora",
    type: "series",
    title: "Aurora City",
    year: 2024,
    rating: 8.6,
    duration: "3 Seasons",
    genre: ["Sci-Fi", "Thriller"],
    description:
      "အနာဂတ်မြို့တော်မှာ အန္တရာယ်အကြီးမားဆုံး စနစ်တစ်ခုက လူတိုင်းကို စမ်းသပ်နေသည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    categoryIds: ["sci-fi", "drama"],
    isTrending: true,
    seasons: [
      {
        id: "aurora-s1",
        seasonNumber: 1,
        episodes: [
          {
            id: "aurora-s1-e1",
            seasonNumber: 1,
            episodeNumber: 1,
            title: "Neon Dawn",
            duration: "48m",
            description:
              "စနစ်အသစ် တက်လာသည့်နေ့မှာ မြို့တော်ကို ပြောင်းလဲခဲ့သည်။",
            posterUrl:
              "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
            telegramUrl: "https://t.me/example",
            embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
            downloadLinks: SERIES_DOWNLOADS,
          },
          {
            id: "aurora-s1-e2",
            seasonNumber: 1,
            episodeNumber: 2,
            title: "Signal Break",
            duration: "52m",
            description:
              "စနစ်ချိုးဖောက်မှုတစ်ခုက မြို့တော်တစ်ခုလုံးကို ဖော်ပြန်စေသည်။",
            posterUrl:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            telegramUrl: "https://t.me/example",
            embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
            downloadLinks: SERIES_DOWNLOADS,
          },
          {
            id: "aurora-s1-e3",
            seasonNumber: 1,
            episodeNumber: 3,
            title: "City of Glass",
            duration: "46m",
            description:
              "ဖွဲ့စည်းပုံထဲက အမှန်တရားကို ရှာဖွေရင်း အန္တရာယ်နဲ့ရင်ဆိုင်မည်။",
            posterUrl:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            telegramUrl: "https://t.me/example",
            embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
            downloadLinks: SERIES_DOWNLOADS,
          },
        ],
      },
    ],
  },
  {
    id: "s-horizon",
    type: "series",
    title: "Horizon Keepers",
    year: 2022,
    rating: 8.1,
    duration: "2 Seasons",
    genre: ["Family", "Adventure"],
    description:
      "ခရီးလမ်းတစ်လျှောက်မှာ မိသားစု၏ အဓိပ္ပာယ်ကို ပြန်လည်တွေ့ရှိမည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    categoryIds: ["family"],
    seasons: [
      {
        id: "horizon-s1",
        seasonNumber: 1,
        episodes: [
          {
            id: "horizon-s1-e1",
            seasonNumber: 1,
            episodeNumber: 1,
            title: "First Trail",
            duration: "42m",
            description: "ခရီးသစ်တစ်ခု စတင်သလို အတိတ်နဲ့ အနာဂတ်က ထပ်ကြုံမည်။",
            posterUrl:
              "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
            telegramUrl: "https://t.me/example",
            embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
            downloadLinks: SERIES_DOWNLOADS,
          },
        ],
      },
    ],
  },
  {
    id: "m-mist",
    type: "movie",
    title: "Mist of Bagan",
    year: 2020,
    rating: 7.0,
    duration: "1h 38m",
    genre: ["Mystery", "Drama"],
    description:
      "အာကာသက မီးခိုးလွှမ်းခြုံတဲ့ နေ့တစ်နေ့မှာ အဘိဓာန်တစ်ခု ပျောက်ဆုံးသွားသည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    downloadLinks: DEFAULT_DOWNLOADS,
    categoryIds: ["drama"],
  },
  {
    id: "m-emberline",
    type: "movie",
    title: "Emberline",
    year: 2025,
    rating: 8.0,
    duration: "2h 01m",
    genre: ["Action", "Sci-Fi"],
    description:
      "အနာဂတ်မြို့တော်ရဲ့ တောင်ကြားတစ်ခုမှာ တစ်ယောက်တည်းရဲ့ ဆုံးဖြတ်ချက်က ကမ္ဘာကို ပြောင်းလဲနိုင်သည်။",
    posterUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
    telegramUrl: "https://t.me/example",
    embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
    downloadLinks: DEFAULT_DOWNLOADS,
    categoryIds: ["action", "sci-fi"],
    isPopular: true,
  },
];
