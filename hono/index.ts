import { Hono } from "hono";
import {
  categoryRoutes,
  movieRoutes,
  reportRoutes,
  requestRoutes,
  tmdbRoutes,
  watchPartyRoutes,
} from "./routes";
import { auth } from "@/lib/auth";

const router = new Hono().basePath("/api");

router.route("/movies", movieRoutes);
router.route("/categories", categoryRoutes);
router.route("/requests", requestRoutes);
router.route("/reports", reportRoutes);
router.route("/tmdb", tmdbRoutes);
router.route("/watch-party", watchPartyRoutes);

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export type AppType = typeof router;
export default router;
