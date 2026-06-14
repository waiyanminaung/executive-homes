"use client";

import { RHFSwitch } from "@geckoui/geckoui";

export default function PropertyFormFlagsSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Visibility</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Published</p>
            <p className="text-xs text-gray-400">Make this listing visible on the website</p>
          </div>
          <RHFSwitch name="isPublished" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Featured</p>
            <p className="text-xs text-gray-400">Show in featured listings sections</p>
          </div>
          <RHFSwitch name="isFeatured" />
        </div>
      </div>
    </div>
  );
}
