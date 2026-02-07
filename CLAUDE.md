# CLAUDE.md — Vizzion.io Project Context

**Last Updated:** February 7, 2026

## What is Vizzion?
Product visualization widget for **any business that sells visual transformations** — property, vehicle, or body. Customers upload a photo → the widget shows what products/services look like on their actual property/vehicle/body → captures email before showing the visualization → qualified lead generation.

**Not just home improvement.** Vizzion serves 17 industries spanning exterior home, interior home, vehicles, marine, landscaping, and body art.

## 17 Industries

### Live (6 pages deployed):
1. ☀️ Solar → `/industries/solar`
2. 🚗 Car/Vehicle Wraps → `/industries/car-wraps`
3. 💈 Tattoos → `/industries/tattoos`
4. 🏊 Swimming Pools → `/industries/swimming-pools`
5. 🌱 Artificial Turf → `/industries/artificial-turf`
6. 🚤 Boat Decking → `/industries/boat-decking`

### Planned (11 pages to build):
7. 🏠 Roofing
8. 🏠 Siding
9. 🪟 Windows & Doors
10. 🪵 Decking
11. 🧱 Fencing
12. 🌿 Landscaping
13. 🎨 Painting
14. 🪣 Gutters
15. 🚪 Garage Doors
16. 🎄 Outdoor Lighting
17. 🏠 Flooring/Countertops

## Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 (beta) with `@theme inline` custom tokens
- Lucide React icons
- Server-side rendering for SEO

## Marketing Skills Installed
6 Claude Code marketing skills are installed in `.claude/skills/`:
- `copywriting` — industry page copy frameworks
- `page-cro` — conversion rate optimization audits
- `product-marketing-context` — foundational context for all marketing tasks
- `programmatic-seo` — template-based SEO at scale
- `schema-markup` — JSON-LD structured data
- `seo-audit` — site-wide SEO analysis

**Product marketing context file:** `.claude/product-marketing-context.md` — read this before any marketing work. It contains Vizzion's positioning, audience, competitors, objections, and brand voice across all 17 industries.

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

## Project Structure
```
app/
  layout.tsx              # Root layout
  page.tsx                # Homepage (imports all sections)
  globals.css             # Tailwind v4 theme + custom tokens
  industries/
    [slug]/
      page.tsx            # Dynamic industry page (data-driven)
components/
  Header.tsx              # Nav with logo + links
  Hero.tsx                # 2-column hero with widget mockup
  SocialProof.tsx         # Trust badges / logos
  ThreeSteps.tsx          # 3-step how-it-works
  Platforms.tsx           # Platform compatibility
  Industries.tsx          # 17 industry cards grid
  Dashboard.tsx           # Dashboard preview
  Testimonials.tsx        # Masonry testimonial grid
  Pricing.tsx             # 3-tier pricing cards
  SignupSection.tsx       # Bottom CTA with form
  Footer.tsx              # Links + legal
  EmbedCodePreview.tsx    # Code snippet display
  WidgetMockup.tsx        # Interactive widget preview
  ParticlesBackground.tsx # Animated background
  industries/             # Shared industry page components
    IndustryHero.tsx
    IndustryProblem.tsx
    IndustrySolution.tsx
    IndustryHowItWorks.tsx
    IndustryBenefits.tsx
    IndustryComparison.tsx
    IndustryFAQ.tsx
    IndustryCTA.tsx
    IndustryTestimonials.tsx
data/
  industries/             # Per-industry content data files
    solar.ts
    car-wraps.ts
    tattoos.ts
    swimming-pools.ts
    artificial-turf.ts
    boat-decking.ts
    index.ts              # IndustryData interface + exports
docs/
  research/               # Strategy & research documents
    vizzion-industry-expansion-report.md
    vizzion-marketingskills-plan.md
    vizzion-solar-page-plan.md
    vizzion-solar-seo-research.md
```

## Industry Page Template
All industry pages are data-driven via the `IndustryData` interface. See `TEMPLATE-RULES.md` for hard rules on voice, structure, SEO, and design. To add a new industry:
1. Create `data/industries/[slug].ts` following the `IndustryData` interface
2. Follow TEMPLATE-RULES.md — no exceptions
3. Note: Non-home industries (car wraps, tattoos, boat decking, etc.) have different upload subjects — "car photo," "body photo," "boat photo" — not just "home photo"

## Key Rules
- **NEVER mention AI/ML/neural networks** in customer-facing copy. Use "realistic visualization," "digital preview," "see it on your actual [home/car/body]"
- **Content-forward pages** — real substance, not SaaS fluff
- **One CTA at bottom** — content sells, CTA converts
- **Match design system exactly** — no one-off styling
