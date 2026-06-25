# Home Banner Search Input Enhancement

## Overview

Enhance the home hero search input with a typing-effect placeholder and a floating dropdown that lets users open province or BTS/MRT transit station pickers, then displays the selection as a plain string in the input.

## Goals

- Make search input hint at searchable dimensions (provinces, transit stations)
- Give users a fast path to province and transit station filtering from the hero
- Wire province filter end-to-end to the properties listing page
- Wire transit station filter end-to-end (requires API addition)

---

## Component: `HomeSearchInput`

**File:** `app/components/home/HomeSearchInput.tsx`

### Typing Effect Placeholder

- Cycles through: `["Provinces", "BTS / MRT Stations", "Bangkok", "Condo, Townhouse..."]`
- `useEffect` interval: typewriter in at 80ms/char → 2s pause → clear → next phrase
- Only active when input value is empty and input is not focused
- On focus: placeholder clears, dropdown opens

### Floating Dropdown

**Trigger:** `onFocus` on input  
**Dismiss:** `mousedown` on document outside the anchor + dropdown, or `Escape` key  
**Positioning:** `useRef` on input wrapper → `getBoundingClientRect()` → `ReactDOM.createPortal` at body level with `position: fixed`, `top`, `left`, `width` derived from ref rect

**Dropdown contents:**
```
┌─────────────────────────────────────┐
│ 🗺  Search by Province              │
├─────────────────────────────────────┤
│ 🚇  Search by BTS/MRT               │
└─────────────────────────────────────┘
```
Icons from `lucide-react`: `MapPin` for province, `Train` for BTS/MRT.

### Province Selection

- Click "Search by Province" → call `openLocationPicker({ onApply })`
- `onApply` receives `LocationSelection { provinceId, provinceName, districtId, districtName, subDistrictIds }`
- Build display string:
  - Province only: `"Bangkok"`
  - Province + district: `"Bangkok › Watthana"`
- Set input value to display string
- Store `provinceId` in component state for URL construction
- Close dropdown

### Transit Station Selection

- Click "Search by BTS/MRT" → call `openTransitStationPicker({ selectedIds: [], onConfirm, multiple: true })`
- `onConfirm` receives `string[]` (station IDs)
- Fetch station names from already-loaded stations data OR pass names through a lookup against `TRANSIT_LINES` constants
- Join names with `", "` → set as input value
- Store `stationIds` in component state for URL construction
- Close dropdown

### Search / Navigation

On "Search" button click or Enter:
- If `provinceId` set → append `provinceId=<id>` to URL params
- If `stationIds` set → append `stationIds=<id1>,<id2>` to URL params
- Navigate to `/properties?tab=...&provinceId=...&stationIds=...`
- `q` (keyword) still works independently; user can type text OR pick location (mutually exclusive — picking a location clears typed text and vice versa)

### Props

```ts
interface HomeSearchInputProps {
  tab: "rent" | "buy";
  onSearch: (params: { q?: string; provinceId?: string; stationIds?: string }) => void;
}
```

---

## Changes: `HomeHero.tsx`

- Extract search input block into `<HomeSearchInput tab={tab} onSearch={handleSearch} />`
- `handleSearch` builds URL params and calls `router.push`

---

## Changes: `ListingPage.tsx`

- Add `const [provinceId] = useQueryState("provinceId")` 
- Add `const [stationIds] = useQueryState("stationIds")`
- Pass both to API query: `...(provinceId ? { provinceId } : {})`, `...(stationIds ? { stationIds } : {})`

---

## Changes: `lib/schema.ts`

Add to `properties` GET query type:
```ts
stationIds?: string;  // comma-separated station IDs
```

---

## Changes: Backend properties route/service

- Parse `stationIds` query param (split by `,`)
- Add Prisma `where` clause: `transitStations: { some: { stationId: { in: stationIdArray } } }`

---

## File Summary

| File | Change |
|------|--------|
| `app/components/home/HomeSearchInput.tsx` | New component |
| `app/components/home/HomeHero.tsx` | Replace Input block with HomeSearchInput |
| `app/components/home/index.ts` | Export HomeSearchInput if needed |
| `components/listing/ListingPage.tsx` | Read provinceId + stationIds from URL |
| `lib/schema.ts` | Add stationIds to properties GET query |
| Backend properties route | Add stationIds filter |

---

## Out of Scope

- Recent searches (no persistence layer planned)
- Geolocation / "Current Location"
- Combining province + transit in single search
