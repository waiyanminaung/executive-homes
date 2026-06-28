# Admin Users Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a SUPERADMIN-only users management page at `/admin/users` with list, create, edit, and delete operations.

**Architecture:** Two-role system (SUPERADMIN + ADMIN). Better-auth admin plugin handles user creation/deletion (password hashing, cascading). Hono route with superAdminMiddleware guards API. Proxy.ts guards page-level access. All UI uses spoosh `useRead`/`useWrite` + GeckoUI components.

**Tech Stack:** better-auth v1.6, better-auth/plugins admin, Prisma (list/update), Hono, Zod, React Hook Form, GeckoUI, spoosh, nuqs (not needed here), lucide-react

## Global Constraints

- Never use `any` type — use proper interfaces
- No comments unless WHY is non-obvious
- Use `classNames` util for multiple className
- Use `pnpm` as package manager
- Wrap all Prisma calls in try/catch, return safe fallback
- Max ~200 lines per component file
- Use early returns over nested if/else
- No `useMemo`/`useCallback`
- Use `FormProvider` from react-hook-form before any RHF components
- Use `lucide-react` for icons
- Add empty lines between logical blocks

---

## File Map

**Create:**
- `constants/auth.ts` — USER_ROLES constant + UserRole type
- `hono/middleware/superAdminMiddleware.ts` — SUPERADMIN-only middleware
- `validation/adminUserSchema.ts` — create/update zod schemas
- `types/adminUser.ts` — AdminUser interface
- `hono/routes/adminUsers.routes.ts` — CRUD route handlers
- `app/(dashboard)/admin/users/components/UsersTable.tsx` — user list table
- `app/(dashboard)/admin/users/components/UsersCreateModal.tsx` — create form
- `app/(dashboard)/admin/users/components/UsersEditModal.tsx` — edit form

**Modify:**
- `lib/auth.ts` — add better-auth admin plugin
- `lib/auth-client.ts` — add admin client plugin
- `hono/middleware/adminMiddleware.ts` — allow SUPERADMIN + ADMIN
- `hono/middleware/index.ts` — export superAdminMiddleware
- `lib/schema.ts` — add AdminUser type + 4 routes
- `hono/routes/index.ts` — export adminUsersRoutes
- `hono/index.ts` — register /admin/users route
- `proxy.ts` — SUPERADMIN guard for /admin/users
- `app/(dashboard)/admin/users/page.tsx` — replace Coming Soon
- `app/(dashboard)/admin/components/AdminSidebar.tsx` — hide Users link for non-SUPERADMIN

---

### Task 1: Role constants + middleware

**Files:**
- Create: `constants/auth.ts`
- Create: `hono/middleware/superAdminMiddleware.ts`
- Modify: `hono/middleware/adminMiddleware.ts`
- Modify: `hono/middleware/index.ts`

**Interfaces:**
- Produces: `USER_ROLES`, `UserRole` type, `superAdminMiddleware`

- [ ] **Step 1: Create role constants**

`constants/auth.ts`:
```ts
export const USER_ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
```

- [ ] **Step 2: Create superAdminMiddleware**

`hono/middleware/superAdminMiddleware.ts`:
```ts
import { createMiddleware } from "hono/factory";

interface SessionUserWithRole {
  role?: string;
}

export const superAdminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as SessionUserWithRole | undefined;

  if (user?.role !== "SUPERADMIN") {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
```

- [ ] **Step 3: Update adminMiddleware to allow SUPERADMIN + ADMIN**

`hono/middleware/adminMiddleware.ts`:
```ts
import { createMiddleware } from "hono/factory";

interface SessionUserWithRole {
  role?: string;
}

export const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("user") as SessionUserWithRole | undefined;

  if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
});
```

- [ ] **Step 4: Export superAdminMiddleware from middleware index**

`hono/middleware/index.ts`:
```ts
export { adminMiddleware } from "./adminMiddleware";
export { authMiddleware } from "./authMiddleware";
export { superAdminMiddleware } from "./superAdminMiddleware";
```

- [ ] **Step 5: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors related to middleware files.

- [ ] **Step 6: Commit**

```bash
git add constants/auth.ts hono/middleware/superAdminMiddleware.ts hono/middleware/adminMiddleware.ts hono/middleware/index.ts
git commit -m "feat(auth): add SUPERADMIN role and superAdminMiddleware"
```

---

### Task 2: Better-auth admin plugin

**Files:**
- Modify: `lib/auth.ts`
- Modify: `lib/auth-client.ts`

**Interfaces:**
- Produces: `auth.api.createUser`, `auth.api.removeUser` (used in Task 5)

- [ ] **Step 1: Add admin plugin to auth.ts**

`lib/auth.ts`:
```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { PrismaClient } from "@/prisma/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "ADMIN",
      adminRoles: ["SUPERADMIN"],
    }),
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "ADMIN",
      },
    },
  },
});
```

- [ ] **Step 2: Add admin client plugin to auth-client.ts**

`lib/auth-client.ts`:
```ts
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [adminClient()],
});
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/auth.ts lib/auth-client.ts
git commit -m "feat(auth): add better-auth admin plugin with SUPERADMIN role"
```

---

### Task 3: Validation schema + types + API schema

**Files:**
- Create: `validation/adminUserSchema.ts`
- Create: `types/adminUser.ts`
- Modify: `lib/schema.ts`

**Interfaces:**
- Produces: `createAdminUserSchema`, `updateAdminUserSchema`, `AdminUserCreateInput`, `AdminUserUpdateInput`, `AdminUser` type, `"admin/users"` + `"admin/users/:id"` routes in ApiSchema

- [ ] **Step 1: Create validation schema**

`validation/adminUserSchema.ts`:
```ts
import { z } from "zod";
import { USER_ROLES } from "@/constants/auth";

const ROLE_VALUES = [USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN] as const;

export const createAdminUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLE_VALUES),
});

export type AdminUserCreateInput = z.infer<typeof createAdminUserSchema>;

export const updateAdminUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(ROLE_VALUES).optional(),
});

export type AdminUserUpdateInput = z.infer<typeof updateAdminUserSchema>;
```

- [ ] **Step 2: Create AdminUser type**

`types/adminUser.ts`:
```ts
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}
```

- [ ] **Step 3: Add routes to lib/schema.ts**

At the top of `lib/schema.ts`, add imports after the last existing import:
```ts
import type { AdminUser } from "@/types/adminUser";
import type { AdminUserCreateInput, AdminUserUpdateInput } from "@/validation/adminUserSchema";
```

Inside `ApiSchema` (before the closing `};`), add:
```ts
  "admin/users": {
    GET: { data: { users: AdminUser[] } };
    POST: { data: { user: AdminUser }; body: AdminUserCreateInput };
  };
  "admin/users/:id": {
    PATCH: { data: { user: AdminUser }; params: { id: string }; body: AdminUserUpdateInput };
    DELETE: { data: { ok: true }; params: { id: string } };
  };
```

- [ ] **Step 4: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add validation/adminUserSchema.ts types/adminUser.ts lib/schema.ts
git commit -m "feat(users): add admin user types, validation schemas, and API schema"
```

---

### Task 4: Hono users route

**Files:**
- Create: `hono/routes/adminUsers.routes.ts`
- Modify: `hono/routes/index.ts`
- Modify: `hono/index.ts`

**Interfaces:**
- Consumes: `authMiddleware`, `adminMiddleware`, `superAdminMiddleware` from `@/hono/middleware`; `auth` from `@/lib/auth`; `prisma` from `@/lib/prisma`; `zv` from `@/validation/zv`; `createAdminUserSchema`, `updateAdminUserSchema` from `@/validation/adminUserSchema`
- Produces: REST endpoints `GET /api/admin/users`, `POST /api/admin/users`, `PATCH /api/admin/users/:id`, `DELETE /api/admin/users/:id`

- [ ] **Step 1: Create adminUsers.routes.ts**

`hono/routes/adminUsers.routes.ts`:
```ts
import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { authMiddleware, adminMiddleware, superAdminMiddleware } from "@/hono/middleware";
import { zv } from "@/validation/zv";
import { createAdminUserSchema, updateAdminUserSchema } from "@/validation/adminUserSchema";
import type { AppEnv } from "@/hono/types";

const adminUsersRoutes = new Hono<AppEnv>();

adminUsersRoutes.use("*", authMiddleware, adminMiddleware, superAdminMiddleware);

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

  const created = await auth.api.createUser({
    body: { name, email, password, role },
    headers: c.req.raw.headers,
  });

  return c.json(
    {
      user: {
        id: created.user.id,
        name: created.user.name,
        email: created.user.email,
        role: (created.user as { role?: string }).role ?? "ADMIN",
        emailVerified: created.user.emailVerified,
        createdAt: created.user.createdAt.toISOString(),
      },
    },
    201,
  );
});

adminUsersRoutes.patch("/:id", zv("json", updateAdminUserSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) return c.json({ error: "User not found" }, 404);

    if (data.role && data.role !== "SUPERADMIN" && existing.role === "SUPERADMIN") {
      const superAdminCount = await prisma.user.count({ where: { role: "SUPERADMIN" } });

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

    if (target.role === "SUPERADMIN") {
      const superAdminCount = await prisma.user.count({ where: { role: "SUPERADMIN" } });

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
```

- [ ] **Step 2: Export from routes index**

Add to `hono/routes/index.ts`:
```ts
export { default as adminUsersRoutes } from "./adminUsers.routes";
```

- [ ] **Step 3: Register route in hono/index.ts**

Add import in `hono/index.ts`:
```ts
import {
  // ... existing imports ...
  adminUsersRoutes,
} from "@/hono/routes";
```

Add route registration after `router.route("/admin/app-content", appContentRoutes);`:
```ts
router.route("/admin/users", adminUsersRoutes);
```

- [ ] **Step 4: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add hono/routes/adminUsers.routes.ts hono/routes/index.ts hono/index.ts
git commit -m "feat(users): add admin users CRUD hono routes"
```

---

### Task 5: Proxy SUPERADMIN guard + sidebar update

**Files:**
- Modify: `proxy.ts`
- Modify: `app/(dashboard)/admin/components/AdminSidebar.tsx`

**Interfaces:**
- Consumes: session role from better-auth `/api/auth/get-session`

- [ ] **Step 1: Update proxy.ts to guard /admin/users for SUPERADMIN only**

`proxy.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_AUTH_PATHS = ["/admin/login", "/admin/register"];
const SUPERADMIN_PATHS = ["/admin/users"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPath = PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p));

  const sessionRes = await fetch(
    new URL("/api/auth/get-session", request.nextUrl.origin),
    { headers: { cookie: request.headers.get("cookie") ?? "" } }
  );

  const session = sessionRes.ok ? await sessionRes.json() : null;

  if (isAuthPath && session?.user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isAuthPath && !session?.user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const isSuperAdminPath = SUPERADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isSuperAdminPath && session?.user?.role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Update AdminSidebar to show Users link only for SUPERADMIN**

In `app/(dashboard)/admin/components/AdminSidebar.tsx`, find the Users link block:
```tsx
          <Link
            href="/admin/users"
            onClick={onClose}
            className={classNames(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive("/admin/users") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
            )}
          >
            <Users className="w-4 h-4 shrink-0" />
            Users
          </Link>
```

Replace with:
```tsx
          {user?.role === "SUPERADMIN" && (
            <Link
              href="/admin/users"
              onClick={onClose}
              className={classNames(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive("/admin/users") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Users className="w-4 h-4 shrink-0" />
              Users
            </Link>
          )}
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add proxy.ts "app/(dashboard)/admin/components/AdminSidebar.tsx"
git commit -m "feat(users): add SUPERADMIN route guard in proxy and sidebar"
```

---

### Task 6: UI — UsersCreateModal + UsersEditModal

**Files:**
- Create: `app/(dashboard)/admin/users/components/UsersCreateModal.tsx`
- Create: `app/(dashboard)/admin/users/components/UsersEditModal.tsx`

**Interfaces:**
- Consumes: `useWrite` from `@/lib/spoosh`; `createAdminUserSchema`, `AdminUserCreateInput` from `@/validation/adminUserSchema`; `updateAdminUserSchema`, `AdminUserUpdateInput` from `@/validation/adminUserSchema`; `AdminUser` from `@/types/adminUser`
- Produces: `UsersCreateModal({ onSaved, onCancel })`, `UsersEditModal({ user, disableRoleChange, onSaved, onCancel })`

- [ ] **Step 1: Create UsersCreateModal**

`app/(dashboard)/admin/users/components/UsersCreateModal.tsx`:
```tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput, RHFSelect } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import { createAdminUserSchema, type AdminUserCreateInput } from "@/validation/adminUserSchema";
import { USER_ROLES } from "@/constants/auth";

const ROLE_OPTIONS = [
  { label: "Admin", value: USER_ROLES.ADMIN },
  { label: "Super Admin", value: USER_ROLES.SUPERADMIN },
];

const DEFAULT_VALUES: AdminUserCreateInput = {
  name: "",
  email: "",
  password: "",
  role: USER_ROLES.ADMIN,
};

interface UsersCreateModalProps {
  onSaved: () => void;
  onCancel: () => void;
}

export function UsersCreateModal({ onSaved, onCancel }: UsersCreateModalProps) {
  const { trigger: createUser } = useWrite((api) => api("admin/users").POST());

  const methods = useForm<AdminUserCreateInput>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(createAdminUserSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await createUser({ body: values });
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4 w-full max-w-md">
        <h3 className="text-base font-semibold text-gray-900">Add Admin User</h3>

        <RHFInput name="name" label="Name" placeholder="Full name" />

        <RHFInput name="email" label="Email" type="email" placeholder="admin@example.com" />

        <RHFInput name="password" label="Password" type="password" placeholder="Min. 8 characters" />

        <RHFSelect name="role" label="Role" options={ROLE_OPTIONS} />

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={methods.formState.isSubmitting}
            className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {methods.formState.isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
```

- [ ] **Step 2: Create UsersEditModal**

`app/(dashboard)/admin/users/components/UsersEditModal.tsx`:
```tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput, RHFSelect } from "@geckoui/geckoui";
import { useWrite } from "@/lib/spoosh";
import { updateAdminUserSchema, type AdminUserUpdateInput } from "@/validation/adminUserSchema";
import { USER_ROLES } from "@/constants/auth";
import type { AdminUser } from "@/types/adminUser";

const ROLE_OPTIONS = [
  { label: "Admin", value: USER_ROLES.ADMIN },
  { label: "Super Admin", value: USER_ROLES.SUPERADMIN },
];

interface UsersEditModalProps {
  user: AdminUser;
  disableRoleChange?: boolean;
  onSaved: () => void;
  onCancel: () => void;
}

export function UsersEditModal({ user, disableRoleChange, onSaved, onCancel }: UsersEditModalProps) {
  const { trigger: updateUser } = useWrite((api) => api("admin/users/:id").PATCH());

  const methods = useForm<AdminUserUpdateInput>({
    values: { name: user.name, role: user.role as AdminUserUpdateInput["role"] },
    resolver: zodResolver(updateAdminUserSchema),
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    await updateUser({ params: { id: user.id }, body: values });
    onSaved();
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4 w-full max-w-md">
        <h3 className="text-base font-semibold text-gray-900">Edit User</h3>

        <RHFInput name="name" label="Name" placeholder="Full name" />

        <RHFSelect name="role" label="Role" options={ROLE_OPTIONS} disabled={disableRoleChange} />

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={methods.formState.isSubmitting}
            className="text-sm font-semibold bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {methods.formState.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/admin/users/components/UsersCreateModal.tsx" "app/(dashboard)/admin/users/components/UsersEditModal.tsx"
git commit -m "feat(users): add create and edit user modals"
```

---

### Task 7: UI — UsersTable + page

**Files:**
- Create: `app/(dashboard)/admin/users/components/UsersTable.tsx`
- Modify: `app/(dashboard)/admin/users/page.tsx`

**Interfaces:**
- Consumes: `useRead`, `useWrite` from `@/lib/spoosh`; `authClient` from `@/lib/auth-client`; `UsersCreateModal`, `UsersEditModal`; `ConfirmDialog`, `Dialog`, `Spinner` from `@geckoui/geckoui`; `AdminUser` from `@/types/adminUser`

- [ ] **Step 1: Create UsersTable**

`app/(dashboard)/admin/users/components/UsersTable.tsx`:
```tsx
"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import { ConfirmDialog, Dialog, Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { authClient } from "@/lib/auth-client";
import { classNames } from "@/utils/classNames";
import { USER_ROLES } from "@/constants/auth";
import type { AdminUser } from "@/types/adminUser";
import { UsersCreateModal } from "./UsersCreateModal";
import { UsersEditModal } from "./UsersEditModal";

function RoleBadge({ role }: { role: string }) {
  const isSuperAdmin = role === USER_ROLES.SUPERADMIN;

  return (
    <span
      className={classNames(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        isSuperAdmin
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700",
      )}
    >
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500",
      )}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UsersTable() {
  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id;

  const { data, loading, trigger: refetch } = useRead((api) => api("admin/users").GET());
  const { trigger: deleteUser } = useWrite((api) => api("admin/users/:id").DELETE());

  const users = data?.users ?? [];

  const superAdminCount = users.filter((u) => u.role === USER_ROLES.SUPERADMIN).length;

  const isDeleteDisabled = (user: AdminUser) => {
    if (user.id === currentUserId) return true;
    if (user.role === USER_ROLES.SUPERADMIN && superAdminCount <= 1) return true;
    return false;
  };

  const isLastSuperAdmin = (user: AdminUser) =>
    user.role === USER_ROLES.SUPERADMIN && superAdminCount <= 1;

  const openCreate = () => {
    Dialog.show({
      content: ({ dismiss }) => (
        <UsersCreateModal onSaved={() => { dismiss(); refetch(); }} onCancel={dismiss} />
      ),
    });
  };

  const openEdit = (user: AdminUser) => {
    Dialog.show({
      content: ({ dismiss }) => (
        <UsersEditModal
          user={user}
          disableRoleChange={isLastSuperAdmin(user)}
          onSaved={() => { dismiss(); refetch(); }}
          onCancel={dismiss}
        />
      ),
    });
  };

  const handleDelete = (user: AdminUser) => {
    ConfirmDialog.show({
      title: "Delete user?",
      content: `"${user.name}" will be permanently removed.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteUser({ params: { id: user.id } });
        refetch();
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="w-6 h-6 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    <VerifiedBadge verified={user.emailVerified} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 text-gray-500 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isDeleteDisabled(user)}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update page.tsx**

`app/(dashboard)/admin/users/page.tsx`:
```tsx
import AdminPageHeader from "../components/AdminPageHeader";
import { UsersTable } from "./components/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader title="Users" description="Manage admin users and access levels." />
      <UsersTable />
    </div>
  );
}
```

- [ ] **Step 3: Run lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/admin/users/components/UsersTable.tsx" "app/(dashboard)/admin/users/page.tsx"
git commit -m "feat(users): implement admin users page with table, create, edit, delete"
```

---

### Task 8: Final review

- [ ] **Step 1: Run full lint + typecheck**

```bash
pnpm lint && pnpm typecheck
```

Expected: zero errors, zero warnings.

- [ ] **Step 2: Run executive-homes-review skill**

Invoke `executive-homes-review` skill to audit all changed files against CLAUDE.md rules.

- [ ] **Step 3: Commit if any review fixes applied**

```bash
git add -p
git commit -m "fix(users): address review findings"
```
