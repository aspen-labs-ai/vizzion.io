# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Vizzion?

Product visualization widget for **any business that sells visual transformations** — property, vehicle, or body. Customers upload a photo → the widget shows what products/services look like on their actual property/vehicle/body → captures email before showing the visualization → qualified lead generation.

**Not just home improvement.** Vizzion serves 17 industries spanning exterior home, interior home, vehicles, marine, landscaping, and body art.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint (eslint-config-next)
```

No test framework is configured. Deployed via Vercel — push to main auto-deploys.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 (beta) with `@theme inline` custom tokens in `app/globals.css`
- Lucide React icons, Motion (framer-motion successor), rough-notation, tailwind-merge
- Server-side rendering for SEO

## Architecture

### Homepage
`app/page.tsx` composes the homepage from section components in `components/` (Hero, SocialProof, ThreeSteps, Platforms, Industries, Dashboard, Testimonials, Pricing, SignupSection). Each section is a standalone React component. Header and Footer wrap every page.

### Industry Pages (data-driven template system)
Each industry has a **static route** at `app/industries/[name]/page.tsx` (e.g., `app/industries/solar/page.tsx`) — these are NOT dynamic `[slug]` routes. Every industry page imports the same set of shared section components from `components/industries/` and passes its data file as props.

**To add a new industry:**
1. Create `data/industries/[slug].ts` exporting an object conforming to the `IndustryData` interface (defined in `data/industries/types.ts`)
2. Create `app/industries/[slug]/page.tsx` — copy an existing one (e.g., `solar/page.tsx`) and swap the data import
3. Follow `TEMPLATE-RULES.md` — no exceptions

**Data flow:** `data/industries/[slug].ts` → `app/industries/[slug]/page.tsx` → `components/industries/Industry*.tsx`

The `IndustryData` interface in `data/industries/types.ts` defines all sections: header, context, showcase (optional), solution, howItWorks, benefits, comparison, testimonials, faq, cta, and seo.

### Industry page section components (`components/industries/`)
IndustryPageHeader, IndustryContext, IndustryShowcase, IndustrySolution, IndustryHowItWorks, IndustryBenefits, IndustryComparison, IndustryTestimonials, IndustryFAQ, IndustryCTA — plus helpers: HighlightedHeadline, HighlightedIntro, HighlightedParagraph, BeforeAfterSlider.

### 17 Industries

**Live (6):** Solar, Car/Vehicle Wraps, Tattoos, Swimming Pools, Artificial Turf, Boat Decking

**Planned (11):** Roofing, Siding, Windows & Doors, Decking, Fencing, Landscaping, Painting, Gutters, Garage Doors, Outdoor Lighting, Flooring/Countertops

## Design System (CRITICAL — match exactly)

All custom colors defined in `app/globals.css` via `@theme inline`:

- **Background:** `bg-bg-primary` (#0D1117), `bg-bg-secondary` (#161B22), `bg-bg-tertiary` (#21262D)
- **Text:** `text-text-primary` (#F9FAFB), `text-text-secondary` (#D1D5DB), `text-text-tertiary` (#9CA3AF)
- **Accent:** `text-accent` (#10B981 emerald green), `bg-accent`, `bg-accent-light`, hover: `hover:bg-accent-hover` (#059669)
- **Borders:** `border-border-default` (#373E47), `border-border-subtle` (#30363D)
- **Font:** Inter (imported via Google Fonts), set as `--font-sans` and `--font-display`

### Component Patterns

All components follow these patterns — use them consistently:
- Section wrapper: `<section className="py-24 px-6 bg-bg-primary">`
- Max width container: `<div className="max-w-[1400px] mx-auto">`
- Section badge: `<div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">`
- Section heading: `<h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">`
- Cards: `bg-bg-secondary rounded-xl border border-border-default hover:border-accent transition-all duration-300`
- CTAs: `bg-accent text-primary hover:bg-accent-hover` with `hover:-translate-y-0.5`

## Key Rules

- **NEVER mention AI/ML/neural networks** in customer-facing copy. Use "realistic visualization," "digital preview," "see it on your actual [home/car/body]"
- **Upload subject varies by industry** — home photo for exterior home, vehicle photo for car wraps, body photo for tattoos, yard photo for pools/turf, boat photo for boat decking. See `TEMPLATE-RULES.md` for the full table.
- **Content-forward pages** — real substance, not SaaS fluff
- **One CTA at bottom** — content sells, CTA converts
- **Match design system exactly** — no one-off styling

## Marketing Context

6 Claude Code marketing skills are installed in `.claude/skills/` (copywriting, page-cro, product-marketing-context, programmatic-seo, schema-markup, seo-audit).

**Read `.claude/product-marketing-context.md` before any marketing work** — it contains Vizzion's positioning, audience, competitors, objections, and brand voice across all 17 industries.

## Key Files

| File | Purpose |
|------|---------|
| `TEMPLATE-RULES.md` | Hard rules for all industry pages (voice, structure, SEO, design) |
| `.claude/product-marketing-context.md` | Product marketing context (positioning, audience, voice) |
| `data/industries/types.ts` | `IndustryData` interface — the contract for all industry data files |
| `app/globals.css` | Tailwind v4 theme tokens + custom animations |
| `docs/research/` | Industry expansion research, marketing plans, page plans |
