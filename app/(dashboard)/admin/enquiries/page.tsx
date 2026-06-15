"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { ConfirmDialog, Spinner } from "@geckoui/geckoui";
import { useRead, useWrite } from "@/lib/spoosh";
import { classNames } from "@/utils/classNames";
import AdminPageHeader from "../components/AdminPageHeader";

const FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Unread", value: "false" },
  { label: "Read", value: "true" },
];

export default function AdminEnquiriesPage() {
  const [isReadFilter, setIsReadFilter] = useState("");

  const { data, loading, trigger: refetch } = useRead((api) =>
    api("admin/enquiries").GET({ query: isReadFilter ? { isRead: isReadFilter } : undefined })
  );

  const { trigger: markRead } = useWrite((api) => api("admin/enquiries/:id/read").PATCH());
  const { trigger: deleteEnquiry } = useWrite((api) => api("admin/enquiries/:id").DELETE());

  const enquiries = data?.enquiries ?? [];

  const handleMarkRead = async (id: string) => {
    await markRead({ params: { id } });
    refetch();
  };

  const handleDelete = (id: string, name: string) => {
    ConfirmDialog.show({
      title: "Delete enquiry?",
      content: `Enquiry from "${name}" will be permanently deleted.`,
      confirmButtonLabel: "Delete",
      onConfirm: async () => {
        await deleteEnquiry({ params: { id } });
        refetch();
      },
    });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Enquiries"
        description="Review and manage property enquiries."
      />

      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setIsReadFilter(opt.value)}
            className={classNames(
              "text-sm font-medium px-4 py-1.5 rounded-md transition-colors",
              isReadFilter === opt.value
                ? "bg-primary-700 text-white"
                : "text-gray-500 hover:text-gray-800",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No enquiries found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className={classNames("transition-colors", !enquiry.isRead ? "bg-blue-50/40" : "hover:bg-gray-50")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!enquiry.isRead && <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{enquiry.name}</p>
                          <p className="text-xs text-gray-400">{enquiry.email}</p>
                          {enquiry.phone && <p className="text-xs text-gray-400">{enquiry.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {enquiry.property ? (
                        <span className="text-sm text-gray-700">{enquiry.property.title}</span>
                      ) : (
                        <span className="text-xs text-gray-400">General</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 truncate">{enquiry.message}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!enquiry.isRead && (
                          <button
                            onClick={() => handleMarkRead(enquiry.id)}
                            className="p-1.5 text-gray-400 hover:text-primary-700 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Mark as read"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                        )}
                        {enquiry.isRead && (
                          <span className="p-1.5 text-gray-300" title="Read">
                            <Mail className="w-4 h-4" />
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(enquiry.id, enquiry.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
