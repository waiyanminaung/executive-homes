"use client";

import { useFormContext } from "react-hook-form";
import { RHFSwitch, LoadingButton } from "@geckoui/geckoui";

interface PropertyFormFlagsSectionProps {
  submitLabel: string;
}

export default function PropertyFormFlagsSection({ submitLabel }: PropertyFormFlagsSectionProps) {
  const { formState } = useFormContext();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Visibility</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Published</p>
            <p className="text-xs text-gray-500">Make this listing visible on the website</p>
          </div>
          <RHFSwitch name="isPublished" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Featured</p>
            <p className="text-xs text-gray-500">Show in featured listings sections</p>
          </div>
          <RHFSwitch name="isFeatured" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Pet Friendly</p>
            <p className="text-xs text-gray-500">Allow pets in this property</p>
          </div>
          <RHFSwitch name="isPetFriendly" />
        </div>
      </div>

      <div className="pt-2">
        <LoadingButton
          type="submit"
          loading={formState.isSubmitting}
          loadingText="Saving..."
          className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {submitLabel}
        </LoadingButton>
      </div>
    </div>
  );
}
