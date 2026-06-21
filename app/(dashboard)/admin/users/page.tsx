import { Users } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";

export default function AdminUsersPage() {
  return (
    <div className="space-y-3">
      <AdminPageHeader title="Users" description="Manage admin users and permissions." />

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Users className="h-6 w-6 text-gray-400" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-gray-700">Coming Soon</h2>
        <p className="mt-1 text-sm text-gray-400">User management will be available in a future update.</p>
      </div>
    </div>
  );
}
