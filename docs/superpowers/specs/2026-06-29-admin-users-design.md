# Admin Users Management — Design Spec

**Date:** 2026-06-29  
**Status:** Approved

## Overview

Implement admin user management page at `/admin/users`. Only `SUPERADMIN` users can access. Replaces the standalone `/admin/register` page as the canonical way to create admin accounts.

## Roles

Two roles:
- `SUPERADMIN` — full access including user management
- `ADMIN` — content management only (properties, enquiries, features, etc.)

Role constants live in `constants/auth.ts`:
```ts
export const USER_ROLES = { SUPERADMIN: "SUPERADMIN", ADMIN: "ADMIN" } as const
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
```

## Auth Changes

### `lib/auth.ts`
Add better-auth `admin` plugin (`better-auth/plugins`). Provides `auth.api.createUser`, `auth.api.listUsers`, `auth.api.deleteUser`, `auth.api.updateUser` — no manual password hashing needed.

### `hono/middleware/adminMiddleware.ts`
Update to allow both `SUPERADMIN` and `ADMIN` roles (currently only checks `ADMIN`).

### `hono/middleware/superAdminMiddleware.ts` (new)
Allows only `SUPERADMIN`. Applied to all users routes.

### `proxy.ts`
Add path-level guard for `/admin/users` — redirect non-SUPERADMIN to `/admin`.

## API Layer

File: `hono/routes/adminUsers.routes.ts`  
All routes: `authMiddleware + superAdminMiddleware`

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `admin/users` | List all users |
| `POST` | `admin/users` | Create user |
| `PATCH` | `admin/users/:id` | Update name + role |
| `DELETE` | `admin/users/:id` | Delete user |

### Response shape (`AdminUser` type in `lib/schema.ts`):
```ts
{
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  createdAt: string
}
```

### Delete guards (enforced server-side):
- Cannot delete self
- Cannot delete last SUPERADMIN

### Validation (`validation/adminUserSchema.ts`):
- `createAdminUserSchema`: name, email, password (min 8), role
- `updateAdminUserSchema`: name (optional), role (optional)

## UI

### File structure:
```
app/(dashboard)/admin/users/
  page.tsx
  components/
    UsersTable.tsx
    UsersCreateModal.tsx
    UsersEditModal.tsx
```

### `page.tsx`
Server component. Checks session — redirects non-SUPERADMIN to `/admin`.

### `UsersTable.tsx`
Client component using `useRead` (spoosh).

Columns:
- Name + email
- Role badge (SUPERADMIN = purple, ADMIN = blue)
- Email verified badge
- Joined date
- Actions: edit icon, delete icon

Guards in UI:
- Self-delete: delete button disabled on current user's row
- Last SUPERADMIN: delete + role-downgrade disabled

No pagination (admin count stays small).

### `UsersCreateModal.tsx`
Fields: name, email, password, role (select: ADMIN | SUPERADMIN)  
Uses `useWrite` + `createAdminUserSchema`.

### `UsersEditModal.tsx`
Fields: name, role select  
Uses `useWrite` + `updateAdminUserSchema`.

## Schema (`lib/schema.ts`)

Add:
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

## Out of Scope

- Password reset from users page
- Session management / active sessions view
- Removing `/admin/register` page (leave as-is for now)
- Pagination
