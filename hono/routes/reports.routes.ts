import { Hono } from "hono";

export const reportRoutes = new Hono().post("/", async (c) => {
  const body = await c.req.json<{
    title?: string;
    reason?: string;
    description?: string;
  }>();

  if (!body?.title || !body?.description) {
    return c.json({ error: "Title and description are required" }, 400);
  }

  return c.json({ ok: true });
});
