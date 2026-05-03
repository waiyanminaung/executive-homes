import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodTypeAny } from "zod";

type ValidationTargetKey = keyof ValidationTargets;

export const zv = <T extends ZodTypeAny>(
  target: ValidationTargetKey,
  schema: T,
) => {
  return zValidator(target, schema);
};
