import { Hono } from "hono";
import { categoryRoutes } from "./routes";
import { auth } from "@/lib/auth";

const router = new Hono().basePath("/api");

router.route("/categories", categoryRoutes);

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export type AppType = typeof router;
export default router;
