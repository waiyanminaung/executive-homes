import type { Content, DownloadLink, Episode, Season } from "@/types/content";
import { type Prisma } from "@/prisma/generated/prisma/client";

export const contentInclude = {
  categories: {
    select: {
      categoryId: true,
    },
  },
  seasons: {
    orderBy: {
      seasonNumber: "asc",
    },
    include: {
      episodes: {
        orderBy: {
          episodeNumber: "asc",
        },
        include: {
          downloadLinks: true,
        },
      },
    },
  },
  downloadLinks: true,
} satisfies Prisma.ContentInclude;

export type ContentWithRelations = Prisma.ContentGetPayload<{
  include: typeof contentInclude;
}>;

const mapDownloadLinks = (
  links: Array<{ url: string; quality: string; size: string }>,
): DownloadLink[] => {
  return links.map((link) => ({
    url: link.url,
    quality: link.quality,
    size: link.size,
  }));
};

const mapEpisode = (
  episode: ContentWithRelations["seasons"][number]["episodes"][number],
): Episode => {
  const downloadLinks = episode.downloadLinks.length
    ? mapDownloadLinks(episode.downloadLinks)
    : undefined;

  return {
    id: episode.id,
    seasonNumber: episode.seasonNumber,
    episodeNumber: episode.episodeNumber,
    title: episode.title,
    duration: episode.duration,
    description: episode.description,
    posterUrl: episode.posterUrl,
    telegramUrl: episode.telegramUrl ?? undefined,
    embedUrl: episode.embedUrl ?? undefined,
    downloadLinks,
  };
};

const mapSeason = (season: ContentWithRelations["seasons"][number]): Season => {
  return {
    id: season.id,
    seasonNumber: season.seasonNumber,
    episodes: season.episodes.map(mapEpisode),
  };
};

export const mapContent = (content: ContentWithRelations): Content => {
  const categoryIds = content.categories.map((item) => item.categoryId);
  const seasons = content.seasons.map(mapSeason);
  const downloadLinks = content.downloadLinks.length
    ? mapDownloadLinks(content.downloadLinks)
    : undefined;

  return {
    id: content.id,
    type: content.type === "MOVIE" ? "movie" : "series",
    title: content.title,
    year: content.year,
    rating: content.rating,
    duration: content.duration ?? undefined,
    genre: content.genre,
    description: content.description,
    posterUrl: content.posterUrl,
    backdropUrl: content.backdropUrl,
    telegramUrl: content.telegramUrl ?? undefined,
    embedUrl: content.embedUrl ?? undefined,
    downloadLinks,
    seasons: seasons.length ? seasons : undefined,
    categoryIds,
    isTrending: content.isTrending,
    isPopular: content.isPopular,
  };
};
