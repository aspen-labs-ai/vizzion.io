# Vizzion.io

**Product visualization widget for businesses that sell visual transformations.** Customers upload a photo of their home, vehicle, yard, or body → see what products/services look like on their actual property → email captured before visualization → qualified lead generation.

## What Vizzion Does

Vizzion is an embeddable widget that turns website visitors into qualified leads. A homeowner uploads a photo of their house, a car owner uploads their vehicle, a tattoo client uploads a body photo — and they see a realistic visualization of the transformation. Before the visualization loads, they enter their email. The business gets a warm, pre-qualified lead.

**Positioning:** Any business that sells visual transformations — property, vehicle, or body.

## 17 Industries

### Live (6 pages deployed)
| Industry | URL | Upload Subject |
|----------|-----|----------------|
| Solar | `/industries/solar` | Home photo |
| Car/Vehicle Wraps | `/industries/car-wraps` | Vehicle photo |
| Tattoos | `/industries/tattoos` | Body photo |
| Swimming Pools | `/industries/swimming-pools` | Yard photo |
| Artificial Turf | `/industries/artificial-turf` | Yard photo |
| Boat Decking | `/industries/boat-decking` | Boat photo |

### Planned (11 pages to build)
Roofing, Siding, Windows & Doors, Decking, Fencing, Landscaping, Painting, Gutters, Garage Doors, Outdoor Lighting, Flooring/Countertops

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS v4 with `@theme inline` custom design tokens
- **Icons:** Lucide React
- **Rendering:** Server-side rendered for SEO performance
- **Design:** Dark theme (emerald green accent on deep navy/black backgrounds)

## Project Structure

```
app/
  layout.tsx                # Root layout
  page.tsx                  # Homepage
  globals.css               # Tailwind v4 theme + custom tokens
  industries/[slug]/        # Dynamic industry pages (data-driven)
components/                 # Shared UI components
  industries/               # Industry page section components
data/industries/            # Per-industry content & data files
docs/research/              # Strategy, research, and planning docs
.claude/
  skills/                   # Marketing skills (copywriting, CRO, SEO, etc.)
  product-marketing-context.md  # Product context for all marketing tasks
```

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI context — read this first when working on the codebase |
| `TEMPLATE-RULES.md` | Hard rules for all industry pages |
| `.claude/product-marketing-context.md` | Product marketing context (positioning, audience, voice) |
| `docs/research/` | Industry expansion research, marketing plans, page plans |

## Deploy

Deployed via Vercel. Push to main → auto-deploy.

## License

Proprietary — Vizzion.io
