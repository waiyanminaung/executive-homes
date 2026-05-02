import { Hono } from "hono";

export const requestRoutes = new Hono().post("/", async (c) => {
  const body = await c.req.json<{ title?: string }>();

  if (!body?.title) {
    return c.json({ error: "Title is required" }, 400);
  }

  return c.json({ ok: true });
});
