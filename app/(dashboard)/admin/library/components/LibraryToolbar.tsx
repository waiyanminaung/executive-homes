"use client";

import { CheckSquare, Search, Trash2, X } from "lucide-react";
import { Button, Input } from "@geckoui/geckoui";

interface LibraryToolbarProps {
  bulkMode: boolean;
  selectedCount: number;
  totalImageCount: number;
  search: string;
  showUploadZone: boolean;
  hasUploadItems: boolean;
  onSearchChange: (val: string) => void;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  onExitBulkMode: () => void;
  onEnterBulkMode: () => void;
  onToggleUploadZone: () => void;
}

export default function LibraryToolbar({
  bulkMode,
  selectedCount,
  totalImageCount,
  search,
  showUploadZone,
  hasUploadItems,
  onSearchChange,
  onSelectAll,
  onBulkDelete,
  onExitBulkMode,
  onEnterBulkMode,
  onToggleUploadZone,
}: LibraryToolbarProps) {
  if (bulkMode) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{selectedCount} selected</span>
        <Button type="button" variant="outlined" size="sm" onClick={onSelectAll}>
          {selectedCount === totalImageCount ? "Deselect All" : "Select All"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          disabled={selectedCount === 0}
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 text-red-600 border-red-300 hover:bg-red-50 disabled:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
          Delete Selected
        </Button>
        <Button type="button" variant="outlined" size="sm" onClick={onExitBulkMode}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-64">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by filename..."
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          suffix={search ? (
            <button type="button" onClick={() => onSearchChange("")}>
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          ) : undefined}
        />
      </div>
      {totalImageCount > 0 && (
        <Button
          type="button"
          variant="outlined"
          onClick={onEnterBulkMode}
          className="flex items-center gap-1.5"
        >
          <CheckSquare className="w-4 h-4" />
          Bulk Select
        </Button>
      )}
      {!hasUploadItems && (
        <Button type="button" variant="outlined" onClick={onToggleUploadZone}>
          {showUploadZone ? "Close" : "Upload Images"}
        </Button>
      )}
    </div>
  );
}
