"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput, RHFSelect, RHFError, SelectOption } from "@geckoui/geckoui";
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

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <RHFInput name="name" placeholder="Full name" />
          <RHFError name="name" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <RHFSelect<string> name="role" disabled={disableRoleChange}>
            {ROLE_OPTIONS.map((opt) => (
              <SelectOption key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </RHFSelect>
          <RHFError name="role" />
        </div>

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
