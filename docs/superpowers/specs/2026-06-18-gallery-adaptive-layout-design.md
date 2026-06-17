# Property Detail Gallery — Adaptive Layout Design

## Problem

`PropertyDetailGallery` always renders a fixed 2-column grid with a 2×2 right panel. When fewer than 5 images exist, empty slots appear — broken layout.

## Solution

Adaptive layout based on `images.length`. Single file change: `PropertyDetailGallery.tsx`.

## Layout Breakpoints

| Image count | Layout |
|-------------|--------|
| 1 | Full-width hero. No grid, no right panel. |
| 2 | 2-col: left = primary (full height), right = 1 secondary (full height) |
| 3 | 2-col: left = primary (full height), right = 2 secondaries stacked vertically (1 col, 2 rows) |
| 4 | 2-col: left = primary (full height), right = top 1 image full width + bottom row 2 images side by side |
| 5+ | 2-col: left = primary, right = 2×2 grid (current behavior). "View All" button shown. |

## Interaction Behavior

All image slots remain clickable — open `PropertyGalleryModal` at the correct index. This applies to all breakpoints.

"View All" button only renders at 5+ images (already bottom-right of right panel).

`extraImageCount` overlay (N+) only renders at 5+ images on the last visible secondary slot.

## Component Structure

No new components needed. All variants handled within `PropertyDetailGallery` via conditional rendering based on `images.length`.

Helper: extract `GalleryImage` inner component for the repeated clickable image slot pattern (avoids repeating the `<button><Image /></button>` block).

## File Touched

| File | Change |
|------|--------|
| `app/properties/[slug]/components/PropertyDetailGallery.tsx` | Adaptive layout with breakpoints |
