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
  mediaRoutes,
  homeSectionsRoutes,
  publicHomeSectionsRoutes,
  homeAreaCardsRoutes,
  publicHomeAreaCardsRoutes,
  contactInfoRoutes,
  publicLocationsRoutes,
  publicTransitStationsRoutes,
  appContentRoutes,
  adminUsersRoutes,
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
router.route("/admin/media", mediaRoutes);
router.route("/admin/home-sections", homeSectionsRoutes);
router.route("/admin/home-area-cards", homeAreaCardsRoutes);
router.route("/admin/contact-info", contactInfoRoutes);
router.route("/admin/app-content", appContentRoutes);
router.route("/admin/users", adminUsersRoutes);

router.route("/properties", publicPropertiesRoutes);
router.route("/home-sections", publicHomeSectionsRoutes);
router.route("/home-area-cards", publicHomeAreaCardsRoutes);
router.route("/enquiries", publicEnquiriesRoutes);
router.route("/locations", publicLocationsRoutes);
router.route("/transit-stations", publicTransitStationsRoutes);

router.onError((err, c) => {
  console.error(err);
  return c.json(
    { error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error" },
    500,
  );
});

export type AppType = typeof router;
export default router;
