import { Hono } from "hono";
import { authMiddleware } from "../middleware";
import { CONTENT, PAGE_SIZE } from "@/constants/content";

export const movieRoutes = new Hono()
  .get("/", (c) => {
    const query = c.req.query();
    const search = query.search?.trim().toLowerCase() ?? "";
    const category = query.category ?? "all";
    const page = Math.max(1, Number(query.page ?? "1") || 1);
    const pageSize = Math.max(
      1,
      Number(query.pageSize ?? PAGE_SIZE) || PAGE_SIZE,
    );

    let items = [...CONTENT];

    if (search) {
      items = items.filter((item) => item.title.toLowerCase().includes(search));
    }

    if (category !== "all") {
      items = items.filter((item) => item.categoryIds.includes(category));
    }

    if (category === "all" && !search) {
      items.sort((a, b) => {
        const scoreA = (a.isTrending ? 2 : 0) + (a.isPopular ? 1 : 0);
        const scoreB = (b.isTrending ? 2 : 0) + (b.isPopular ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const pagedItems = items.slice(start, start + pageSize);

    return c.json({ items: pagedItems, total });
  })
  .get("/:id", (c) => {
    const id = c.req.param("id");
    const movie = CONTENT.find((item) => item.id === id);

    if (!movie) {
      return c.json({ error: "Movie not found" }, 404);
    }

    return c.json(movie);
  })
  .use(authMiddleware)
  .post("/", (c) => {
    return c.json({ message: "Movie created" });
  });
