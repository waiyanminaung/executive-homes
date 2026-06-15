import { Hono } from "hono";
import { auth } from "@/lib/auth";
import {
  propertyRoutes,
  propertyTypesRoutes,
  provincesRoutes,
  featuresRoutes,
  transitStationsRoutes,
  locationsRoutes,
  adminEnquiriesRoutes,
  publicPropertiesRoutes,
  publicEnquiriesRoutes,
} from "@/hono/routes";

const router = new Hono().basePath("/api");

router.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

router.route("/admin/properties", propertyRoutes);
router.route("/admin/property-types", propertyTypesRoutes);
router.route("/admin/provinces", provincesRoutes);
router.route("/admin/features", featuresRoutes);
router.route("/admin/transit-stations", transitStationsRoutes);
router.route("/admin/locations", locationsRoutes);
router.route("/admin/enquiries", adminEnquiriesRoutes);

router.route("/properties", publicPropertiesRoutes);
router.route("/enquiries", publicEnquiriesRoutes);

export type AppType = typeof router;
export default router;
