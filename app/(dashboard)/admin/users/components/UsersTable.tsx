"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import { Button, ConfirmDialog, Dialog, Spinner } from "@geckoui/geckoui";
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
        <Button
          onClick={openCreate}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
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
