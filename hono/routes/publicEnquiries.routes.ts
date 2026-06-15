import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { zv } from "@/validation/zv";
import { publicEnquirySchema } from "@/validation/publicEnquirySchema";

const publicEnquiriesRoutes = new Hono();

publicEnquiriesRoutes.post("/", zv("json", publicEnquirySchema), async (c) => {
  const { propertyId, listingType, subject, ...rest } = c.req.valid("json");

  await prisma.enquiry.create({
    data: {
      ...rest,
      message: subject ? `[${subject}] ${rest.message}` : rest.message,
      propertyId: propertyId ?? null,
      listingType: listingType ?? null,
    },
  });

  return c.json({ ok: true }, 201);
});

export default publicEnquiriesRoutes;
