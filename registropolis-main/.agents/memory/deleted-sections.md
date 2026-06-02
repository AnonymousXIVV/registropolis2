---
name: Deleted Sections
description: Food and Taxi sections fully removed from codebase
---

# Deleted Sections

## Food
- `src/components/food/` — entire directory deleted
- `src/pages/Food.tsx` — deleted
- All references removed from DashboardSection.tsx and SidebarData.tsx

## Taxi
- `src/components/taxi/` — entire directory deleted
- `src/pages/Taxi.tsx` — deleted
- All references removed from DashboardSection.tsx and SidebarData.tsx

## App.tsx redirects
- `/food` and `/taxi` redirect to `/dashboard` (not to their old sections)

**Why:** Explicit user request. These sections no longer exist in the app.

## Remaining sections
Messages · Marketplace · Jobs · Services · Real Estate · Transport · Events · Settings · (Admin — admin-only)

Note: `Transport` is distinct from the deleted `Taxi & Transport`. Transport = vehicle marketplace.
