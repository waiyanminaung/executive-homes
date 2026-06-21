"use client";

import { Dialog } from "@geckoui/geckoui";
import LocationPickerContent from "./LocationPickerContent";

export interface LocationSelection {
  provinceId: string | null;
  districtId: string | null;
  subDistrictIds: string[] | null;
  provinceName: string | null;
  districtName: string | null;
}

interface LocationPickerOpts {
  initialValue?: LocationSelection;
  onApply: (selection: LocationSelection) => void;
}

export function openLocationPicker(opts: LocationPickerOpts) {
  Dialog.show({
    className: "w-full max-w-sm p-0 overflow-hidden",
    dismissOnOutsideClick: false,
    content: ({ dismiss }) => (
      <LocationPickerContent
        onApply={(sel) => { opts.onApply(sel); dismiss(); }}
        onClose={dismiss}
      />
    ),
  });
}
