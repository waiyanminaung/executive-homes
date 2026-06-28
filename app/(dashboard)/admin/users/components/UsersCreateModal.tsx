"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput, RHFSelect, RHFError, SelectOption } from "@geckoui/geckoui";
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

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <RHFInput name="name" placeholder="Full name" />
          <RHFError name="name" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <RHFInput name="email" type="email" placeholder="admin@example.com" />
          <RHFError name="email" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <RHFInput name="password" type="password" placeholder="Min. 8 characters" />
          <RHFError name="password" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <RHFSelect<string> name="role">
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
            {methods.formState.isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
