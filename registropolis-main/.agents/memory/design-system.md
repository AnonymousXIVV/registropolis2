---
name: Buzzer Design System
description: Premium indigo/white design tokens, component classes, typography, and section template conventions
---

# Buzzer Design System

## Core Tokens (index.css)
- Background: `210 17% 98%` (~F8FAFC)
- Foreground: `222 47% 9%` (near-black)
- Primary: `239 84% 65%` (indigo-500 ~6366F1)
- Border: `214 32% 91%` (~E2E8F0)
- Muted foreground: `215 16% 47%` (~64748B)
- Radius: `0.625rem` (10px)
- Font: Inter (Google Fonts) with `font-feature-settings: "cv02","cv03","cv04","cv11"`

**Why:** User explicitly requested "billion dollar" premium, macOS/iOS feel, no glassmorphism. Clean white-on-light-gray approach mirrors Stripe/Linear/Vercel.

## CSS Component Classes
- `.card-premium` — white bg, `border-slate-100`, `shadow-sm hover:shadow-md`, `rounded-xl`
- `.section-padding` — `px-6 py-6 lg:px-8 lg:py-8`
- `.section-header` — flex row between header+CTA
- `.chip` + `.chip-active` + `.chip-default` — filter pills (indigo active, white+border default)
- `.gradient-text` — indigo→violet gradient clip text

## Section Page Template
Every section follows: page header (title+desc+CTA) → search input → category chips → result count → card grid (1→2→3→4 cols).

## Photos
All real Unsplash photos via `?auto=format&fit=crop&w=800&q=80`. Each section uses relevant photos:
- Marketplace: products (laptop, headphones, sneakers, camera, watch, sofa, bike, bag)
- Jobs: no photos — company gradient-letter logos
- Services: professional headshots/work scenes
- Real Estate: property exteriors/interiors
- Transport: vehicles
- Events: venues/concerts

## Sidebar
- Pure white bg (`bg-white`), `border-r border-slate-100`
- Header: Zap icon in indigo→violet gradient, "Buzzer" + "COMMUNITY" label
- Active item: `bg-primary/8 text-primary` (indigo tint)
- Footer: Settings link + Quick Sign In (User/Admin) or user avatar + sign-out

## No glassmorphism anywhere
The `.glass-morphism` class is kept for backward compatibility but redirected to a simple white/border style.
