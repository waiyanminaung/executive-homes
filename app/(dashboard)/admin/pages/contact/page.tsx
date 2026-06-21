import { Clock } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader";

export default function AdminContactPage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Contact Page"
        description="Manage the content and settings for the contact page."
      />

      <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Clock className="h-7 w-7 text-gray-400" />
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">Coming Soon</p>
          <p className="mt-1 text-sm text-gray-500">
            Contact page management is currently under development.
          </p>
        </div>
      </div>
    </div>
  );
}
