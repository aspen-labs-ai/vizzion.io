# CLAUDE.md — Vizzion.io Project Context

## What is Vizzion?
Product visualization widget for home improvement businesses. Homeowners upload photos of their house → widget shows what products look like on their property → captures email before visualization → qualified lead generation.

## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 (beta) with `@theme inline` custom tokens
- Lucide React icons
- Server-side rendering for SEO

## Design System (CRITICAL — match exactly)
- **Background:** `bg-bg-primary` (#0D1117), `bg-bg-secondary` (#161B22), `bg-bg-tertiary` (#21262D)
- **Text:** `text-text-primary` (#F9FAFB), `text-text-secondary` (#D1D5DB), `text-text-tertiary` (#9CA3AF)
- **Accent:** `text-accent` (#10B981 emerald green), `bg-accent`, `bg-accent-light`, hover: `accent-hover` (#059669)
- **Borders:** `border-border-default` (#373E47), `border-border-subtle` (#30363D)
- **Fonts:** Inter (body, imported via Google Fonts), system default (headings use font-bold)
- All custom colors defined in `app/globals.css` via `@theme inline`

## Existing Component Patterns
All components follow the same patterns:
- Section wrapper: `<section className="py-24 px-6 bg-bg-primary">`
- Max width container: `<div className="max-w-[1400px] mx-auto">`
- Section badge: `<div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">`
- Section heading: `<h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">`
- Cards: `bg-bg-secondary rounded-xl border border-border-default hover:border-accent transition-all duration-300`
- CTAs: `bg-accent text-primary hover:bg-accent-hover` with hover:-translate-y-0.5

## Current Structure
```
app/
  layout.tsx          # Root layout
  page.tsx            # Homepage (imports all sections)
  globals.css         # Tailwind v4 theme + custom tokens
components/
  Header.tsx          # Nav with logo + links
  Hero.tsx            # 2-column hero with widget mockup
  SocialProof.tsx     # Trust badges / logos
  ThreeSteps.tsx      # 3-step how-it-works
  Platforms.tsx       # Platform compatibility
  Industries.tsx      # 12 industry cards grid
  Dashboard.tsx       # Dashboard preview
  Testimonials.tsx    # Masonry testimonial grid
  Pricing.tsx         # 3-tier pricing cards
  SignupSection.tsx   # Bottom CTA with form
  Footer.tsx          # Links + legal
  EmbedCodePreview.tsx # Code snippet display
  WidgetMockup.tsx    # Interactive widget preview
  ParticlesBackground.tsx # Animated background
```

## Current Task: Build `/industries/solar` Landing Page
See `SOLAR-PAGE-PLAN.md` for the complete section-by-section plan.
This page must:
1. Match the existing site design EXACTLY (same colors, spacing, card styles)
2. Be data-driven so we can reuse components for 11 more industries
3. Be SEO-optimized (schema markup, semantic HTML, proper heading hierarchy)
4. Be mobile-first and responsive
