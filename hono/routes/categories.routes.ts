import { Hono } from "hono";
import { CATEGORIES } from "@/constants/content";

export const categoryRoutes = new Hono().get("/", (c) => {
  return c.json(CATEGORIES);
});
