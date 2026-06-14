import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { propertyRoutes, provincesRoutes } from "@/hono/routes";

const router = new Hono().basePath("/api");

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

router.route("/admin/properties", propertyRoutes);
router.route("/admin/provinces", provincesRoutes);

export type AppType = typeof router;
export default router;
