"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Spinner } from "@geckoui/geckoui";
import { useRead } from "@/lib/spoosh";
import AdminPageHeader from "../../components/AdminPageHeader";
import HomeSectionRow from "./components/HomeSectionRow";
import HomeSectionForm from "./components/HomeSectionForm";

export default function AdminHomePage() {
  const { data, loading, trigger: refetch } = useRead((api) => api("admin/home-sections").GET());
  const [expandedId, setExpandedId] = useState<string | "new" | null>(null);

  const sections = data?.sections ?? [];

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSaved = () => {
    setExpandedId(null);
    refetch();
  };

  const handleDeleted = () => {
    setExpandedId(null);
    refetch();
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Home Page Sections"
        description="Configure the property listing sections shown on the home page."
        actions={
          <button
            onClick={() => setExpandedId("new")}
            className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {sections.length === 0 && expandedId !== "new" && (
            <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
              <p className="text-gray-400 text-sm">No sections yet. Add your first one.</p>
            </div>
          )}

          {sections.map((section) => (
            <HomeSectionRow
              key={section.id}
              section={section}
              isExpanded={expandedId === section.id}
              onToggle={() => handleToggle(section.id)}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          ))}

          {expandedId === "new" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">New Section</p>
              </div>
              <HomeSectionForm
                section={null}
                onSaved={handleSaved}
                onCancel={() => setExpandedId(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
