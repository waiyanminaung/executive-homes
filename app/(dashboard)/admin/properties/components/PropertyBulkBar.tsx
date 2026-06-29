"use client";

import { EyeOff, Eye, Trash2, X } from "lucide-react";
import { Button } from "@geckoui/geckoui";

interface PropertyBulkBarProps {
  selectedCount: number;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function PropertyBulkBar({ selectedCount, onPublish, onUnpublish, onDelete, onClear }: PropertyBulkBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-xl">
      <span className="text-sm font-medium text-primary-700 mr-1">
        {selectedCount} selected
      </span>

      <Button type="button" size="sm" variant="outlined" onClick={onPublish} className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5" />
        Publish
      </Button>

      <Button type="button" size="sm" variant="outlined" onClick={onUnpublish} className="flex items-center gap-1.5">
        <EyeOff className="w-3.5 h-3.5" />
        Unpublish
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outlined"
        onClick={onDelete}
        className="flex items-center gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </Button>

      <button
        type="button"
        onClick={onClear}
        className="ml-auto p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
