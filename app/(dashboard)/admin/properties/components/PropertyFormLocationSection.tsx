"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { UseFormSetValue } from "react-hook-form";
import { RHFInput, RHFSelect, RHFError, SelectOption, SelectDropdownSearch, SelectEmpty, Label, Dialog, Button, Textarea } from "@geckoui/geckoui";
import { MapPin } from "lucide-react";
import { useRead } from "@/lib/spoosh";

import type { Province } from "@/types/property";
import type { PropertyCreateInput } from "@/validation/propertySchema";

interface PropertyFormLocationSectionProps {
  provinces: Province[];
}

function parseGoogleMapsUrl(url: string): { name: string | null; lat: number; lng: number } | null {
  const nameMatch = url.match(/\/place\/([^/]+)\//);
  const name = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, " ")) : null;

  const place = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);

  if (place) {
    return { name, lat: Number(place[1]), lng: Number(place[2]) };
  }

  const camera = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (camera) {
    return { name, lat: Number(camera[1]), lng: Number(camera[2]) };
  }

  return null;
}

interface LinkImportDialogProps {
  dismiss: () => void;
  setValue: UseFormSetValue<PropertyCreateInput>;
}

function LinkImportDialog({ dismiss, setValue }: LinkImportDialogProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    const result = parseGoogleMapsUrl(url);

    if (!result) {
      setError("No coordinates found. Paste a valid Google Maps link.");
      return;
    }

    setValue("lat", result.lat);
    setValue("lng", result.lng);
    dismiss();
  };

  return (
    <div className="bg-white rounded-2xl space-y-4 w-full">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">Import from Google Maps Link</h3>
        <p className="text-sm text-gray-500">Paste a Google Maps URL to extract coordinates.</p>
      </div>

      <div className="space-y-1.5">
        <Label>Google Maps URL</Label>
        <Textarea
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://www.google.com/maps/place/..."
          rows={3}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outlined" type="button" onClick={dismiss}>Cancel</Button>
        <Button type="button" onClick={handleImport} disabled={!url.trim()}>Import</Button>
      </div>
    </div>
  );
}

export default function PropertyFormLocationSection({ provinces }: PropertyFormLocationSectionProps) {
  const { watch, setValue } = useFormContext<PropertyCreateInput>();
  const lat = watch("lat");
  const lng = watch("lng");
  const provinceId = watch("provinceId");
  const districtId = watch("districtId");
  const hasCoords = !!lat && !!lng;

  const { data: districtsData } = useRead((api) =>
    api("admin/locations/districts").GET({ query: provinceId ? { provinceId } : undefined }),
  );
  const districts = districtsData?.districts ?? [];

  const { data: subDistrictsData } = useRead((api) =>
    api("admin/locations/subdistricts").GET({ query: districtId ? { districtId } : undefined }),
  );
  const subDistricts = subDistrictsData?.subDistricts ?? [];

  useEffect(() => {
    setValue("districtId", null);
    setValue("subDistrictId", null);
  }, [provinceId, setValue]);

  useEffect(() => {
    setValue("subDistrictId", null);
  }, [districtId, setValue]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-900">Location</h2>

      <div className="space-y-1.5">
        <Label required>Address</Label>
        <RHFInput name="address" placeholder="Street address, building name..." />
        <RHFError name="address" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Province</Label>
          <RHFSelect<string> name="provinceId" placeholder="Select province...">
            {provinces.map((p) => (
              <SelectOption key={p.id} value={p.id} label={p.name} />
            ))}
          </RHFSelect>
          <RHFError name="provinceId" />
        </div>

        {provinceId && (
          <div className="space-y-1.5">
            <Label>District</Label>
            <RHFSelect<string> name="districtId" placeholder="Select district..." clearable>
              <SelectDropdownSearch />
              {districts.map((d) => (
                <SelectOption key={d.id} value={d.id} label={d.name} />
              ))}
              <SelectEmpty />
            </RHFSelect>
            <RHFError name="districtId" />
          </div>
        )}
      </div>

      {districtId && (
        <div className="space-y-1.5">
          <Label>Subdistrict</Label>
          <RHFSelect<string> name="subDistrictId" placeholder="Select subdistrict..." clearable>
            <SelectDropdownSearch />
            {subDistricts.map((s) => (
              <SelectOption key={s.id} value={s.id} label={s.name} />
            ))}
            <SelectEmpty />
          </RHFSelect>
          <RHFError name="subDistrictId" />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Coordinates</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => Dialog.show({ content: ({ dismiss }) => <LinkImportDialog dismiss={dismiss} setValue={setValue} /> })}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
          >
            <MapPin className="w-3.5 h-3.5" />
            Import from Google Maps
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <RHFInput name="lat" placeholder="e.g. 13.7563" type="number" step="any" />
            <RHFError name="lat" />
          </div>

          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <RHFInput name="lng" placeholder="e.g. 100.5018" type="number" step="any" />
            <RHFError name="lng" />
          </div>
        </div>
      </div>

      {hasCoords && (
        <div className="rounded-lg overflow-hidden border border-gray-200 h-56">
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

    </div>
  );
}
