# Industry Page Template Rules

Guidelines for all `/industries/[slug]` pages. These are hard rules — no exceptions.

## Voice & Language

- **NEVER mention AI, artificial intelligence, machine learning, or neural networks.** The technology behind visualizations is irrelevant to customers. Use: "realistic visualization," "digital preview," "see it on your actual home," "photo-realistic transformation."
- Write like you're talking to a business owner, not a developer. No jargon.
- Be specific to the industry. Don't write generic SaaS copy — write like you understand their business.
- Use real industry terminology (e.g., "close rate," "speed to lead," "cost per acquisition" for solar).

## Page Feel

- **These are interior content pages, NOT standalone landing pages.** They live within the Vizzion site and should feel like a natural deep-dive, not a separate microsite.
- **Content-forward.** Real paragraphs, real substance. Think industry report meets sales page.
- **No full-screen heroes.** Use a compact page header: badge, h1, 2-3 sentence intro. That's it.
- **No aggressive CTAs above the fold.** One tasteful CTA at the bottom. The content sells — the CTA converts.
- **Visual breaks, not visual walls.** Cards, callouts, and metrics should break up the text, not replace it.

## Structure

Every industry page follows this order:

1. **Page Header** — Industry badge, h1 headline, intro paragraph
2. **Industry Context** — 2-3 paragraphs about the industry's lead generation challenges. Real substance.
3. **How Vizzion Helps** — Descriptive section with inline metrics/callouts. How does Vizzion specifically solve this industry's problems?
4. **How It Works** — 3-step process, descriptive (not just cards)
5. **Benefits** — Metrics and outcomes, presented as cards or inline callouts
6. **Comparison** — Old Way vs Vizzion side-by-side
7. **Testimonials** — Social proof from industry peers
8. **FAQ** — Accordion with JSON-LD schema (SEO)
9. **CTA** — Single, clean call-to-action at bottom

## SEO

- Every page targets 2,000+ words of real content
- H1 contains primary keyword naturally
- FAQ section uses FAQPage schema markup
- Meta title format: `[Industry] Visualization Widget for Lead Generation | Vizzion`
- Include industry-specific long-tail keywords naturally in body content
- Structured data (SoftwareApplication, FAQPage, BreadcrumbList)

## Design

- Match the existing Vizzion site design exactly — same colors, spacing, typography
- Use the shared component library (no one-off styling)
- All content is data-driven via the `IndustryData` interface
- Components accept data props — swap the data file, get a new industry page

## Adding a New Industry

1. Create `data/industries/[slug].ts` following the `IndustryData` interface
2. Create `app/industries/[slug]/page.tsx` importing the data and shared components
3. Follow these rules. No exceptions.
