import { Hono } from "hono";
import { adminMiddleware, authMiddleware } from "../middleware";
import { prisma } from "@/lib/prisma";
import {
  categoryCreateSchema,
  categoryDeleteSchema,
  categoryIdParamSchema,
  categoryOrderSchema,
  categoryUpdateSchema,
} from "@/validation/categoriesSchema";
import { zv } from "@/validation/zv";

export const categoryRoutes = new Hono()
  .get("/", async (c) => {
    const categories = await prisma.category.findMany({
      orderBy: {
        orderIndex: "asc",
      },
    });

    return c.json(categories);
  })
  .use(authMiddleware)
  .use(adminMiddleware)
  .post("/", zv("json", categoryCreateSchema), async (c) => {
    const body = c.req.valid("json");
    const category = await prisma.category.create({
      data: body,
    });

    return c.json(category);
  })
  .put(
    "/:id",
    zv("param", categoryIdParamSchema),
    zv("json", categoryUpdateSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const category = await prisma.category.update({
        where: { id },
        data: body,
      });

      return c.json(category);
    },
  )
  .patch("/order", zv("json", categoryOrderSchema), async (c) => {
    const { categories } = c.req.valid("json");

    await prisma.$transaction(
      categories.map((category) =>
        prisma.category.update({
          where: { id: category.id },
          data: { orderIndex: category.orderIndex },
        }),
      ),
    );

    return c.json({ ok: true });
  })
  .delete(
    "/:id",
    zv("param", categoryIdParamSchema),
    zv("json", categoryDeleteSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { replacementCategoryId } = c.req.valid("json");

      if (replacementCategoryId === id) {
        return c.json({ error: "Choose a different category to move to" }, 400);
      }

      await prisma.$transaction(async (tx) => {
        if (replacementCategoryId) {
          const linkedContent = await tx.contentCategory.findMany({
            where: { categoryId: id },
            select: { contentId: true },
          });

          await tx.contentCategory.createMany({
            data: linkedContent.map((item) => ({
              contentId: item.contentId,
              categoryId: replacementCategoryId,
            })),
            skipDuplicates: true,
          });
        }

        await tx.contentCategory.deleteMany({
          where: { categoryId: id },
        });
        await tx.category.delete({
          where: { id },
        });
      });

      return c.json({ ok: true });
    },
  );
