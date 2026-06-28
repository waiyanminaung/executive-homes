import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { authMiddleware, superAdminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { createAdminUserSchema, updateAdminUserSchema } from "@/validation/adminUserSchema";
import { USER_ROLES } from "@/constants/auth";
import type { AppEnv } from "@/hono/types";

const adminUsersRoutes = new Hono<AppEnv>();

adminUsersRoutes.use("*", authMiddleware, superAdminMiddleware);

adminUsersRoutes.get("/", async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return c.json({ users });
  } catch {
    return c.json({ users: [] });
  }
});

adminUsersRoutes.post("/", zv("json", createAdminUserSchema), async (c) => {
  const { name, email, password, role } = c.req.valid("json");

  try {
    const created = await auth.api.createUser({
      body: { name, email, password },
      headers: c.req.raw.headers,
    });

    const user = await prisma.user.update({
      where: { id: created.user.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return c.json({ user }, 201);
  } catch {
    return c.json({ error: "Failed to create user" }, 500);
  }
});

adminUsersRoutes.patch("/:id", zv("json", updateAdminUserSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) return c.json({ error: "User not found" }, 404);

    if (data.role && data.role !== USER_ROLES.SUPERADMIN && existing.role === USER_ROLES.SUPERADMIN) {
      const superAdminCount = await prisma.user.count({ where: { role: USER_ROLES.SUPERADMIN } });

      if (superAdminCount <= 1) {
        return c.json({ error: "Cannot demote the last SUPERADMIN" }, 400);
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return c.json({ user });
  } catch {
    return c.json({ error: "Failed to update user" }, 500);
  }
});

adminUsersRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const currentUser = c.get("user");

  if (currentUser.id === id) {
    return c.json({ error: "Cannot delete your own account" }, 400);
  }

  try {
    const target = await prisma.user.findUnique({ where: { id } });

    if (!target) return c.json({ error: "User not found" }, 404);

    if (target.role === USER_ROLES.SUPERADMIN) {
      const superAdminCount = await prisma.user.count({ where: { role: USER_ROLES.SUPERADMIN } });

      if (superAdminCount <= 1) {
        return c.json({ error: "Cannot delete the last SUPERADMIN" }, 400);
      }
    }

    await auth.api.removeUser({
      body: { userId: id },
      headers: c.req.raw.headers,
    });

    return c.json({ ok: true });
  } catch {
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

export default adminUsersRoutes;
