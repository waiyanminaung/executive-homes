import { Hono } from "hono";
import { authMiddleware } from "../middleware";
import { PAGE_SIZE } from "@/constants/content";
import { prisma } from "@/lib/prisma";
import { contentInclude, mapContent } from "@/lib/contentMapper";
import {
  movieCreateSchema,
  movieIdParamSchema,
  movieListQuerySchema,
} from "@/validation/moviesSchema";
import { zv } from "@/validation/zv";
import { Prisma } from "@/prisma/generated/prisma/client";

export const movieRoutes = new Hono()
  .get("/", zv("query", movieListQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const category = query.category ?? "all";
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? PAGE_SIZE;
    const search = query.search?.trim();
    const where: Prisma.ContentWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (category !== "all") {
      where.categories = {
        some: {
          categoryId: category,
        },
      };
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput[] =
      !search && category === "all"
        ? [
            { isTrending: Prisma.SortOrder.desc },
            { isPopular: Prisma.SortOrder.desc },
            { createdAt: Prisma.SortOrder.desc },
          ]
        : [{ createdAt: Prisma.SortOrder.desc }];

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: contentInclude,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.content.count({ where }),
    ]);

    return c.json({ items: items.map(mapContent), total });
  })
  .get("/:id", zv("param", movieIdParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const movie = await prisma.content.findUnique({
      where: { id },
      include: contentInclude,
    });

    if (!movie) {
      return c.json({ error: "Movie not found" }, 404);
    }

    return c.json(mapContent(movie));
  })
  .use(authMiddleware)
  .post("/", zv("json", movieCreateSchema), async (c) => {
    const body = c.req.valid("json");

    const movie = await prisma.content.create({
      data: {
        type: body.type === "movie" ? "MOVIE" : "SERIES",
        title: body.title,
        year: body.year,
        rating: body.rating,
        duration: body.duration || null,
        genre: body.genre
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        description: body.description,
        posterUrl: body.posterUrl,
        backdropUrl: body.backdropUrl,
        telegramUrl: body.telegramUrl || null,
        embedUrl: body.embedUrl || null,
        isTrending: body.isTrending,
        isPopular: body.isPopular,
        categories: body.categoryIds.length
          ? {
              create: body.categoryIds.map((categoryId) => ({ categoryId })),
            }
          : undefined,
      },
      include: contentInclude,
    });

    return c.json(mapContent(movie));
  });
