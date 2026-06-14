import { Hono } from "hono";
import { auth } from "@/lib/auth";

const router = new Hono().basePath("/api");

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export type AppType = typeof router;
export default router;
