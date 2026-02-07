# Marketing Skills Integration Plan for Vizzion.io

## What Is This Repo?

[coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) is a collection of **25 Claude Code skills** for marketing tasks — CRO, copywriting, SEO, analytics, and growth. Built by Corey Haines (Conversion Factory / Swipe Files).

These are markdown "skill files" that give Claude Code specialized frameworks and checklists when working on marketing tasks. They install into `.claude/skills/` in any project.

---

## How It Applies to Vizzion

Vizzion is a marketing-heavy site — industry landing pages, conversion funnels, SEO play across 12 verticals. These skills are directly relevant.

---

## Phase 1: Foundation (Do First)

### 1. Create Product Marketing Context File
**Skill:** `product-marketing-context`
**What:** Create `.claude/product-marketing-context.md` — a structured doc that ALL other marketing skills reference before doing anything. Captures Vizzion's positioning, audience, competitors, objections, customer language, brand voice, and proof points.
**Why:** Every single skill in this repo checks for this file first. Without it, Claude Code asks the same questions every time. With it, every marketing task starts pre-loaded with Vizzion context.
**Effort:** ~30 min to draft (we already have `discord-vizzion.md` + SEO research as raw material)

### 2. Install Core Skills
**Skill:** Multiple
**What:** Install the skills that map to what we're actively building:
- `copywriting` — we're writing copy for 12 industry pages
- `page-cro` — conversion optimization for every page
- `schema-markup` — we already have JSON-LD in the industry template
- `seo-audit` — audit the site as we build it
- `programmatic-seo` — our industry pages ARE programmatic SEO (template + data × 12 industries)
**Install:** `npx skills add coreyhaines31/marketingskills --skill copywriting page-cro schema-markup seo-audit programmatic-seo`

---

## Phase 2: Active Use (Apply to Current Work)

### 3. Run CRO Audit on Homepage
**Skill:** `page-cro`
**What:** Have Claude Code analyze the current homepage against the CRO framework — value prop clarity, headline effectiveness, CTA hierarchy, trust signals, objection handling, friction points.
**Why:** The homepage is live and hasn't been optimized through a conversion lens. Quick wins likely hiding in plain sight.
**Output:** Prioritized list of quick wins + high-impact changes + A/B test ideas.

### 4. Run CRO Audit on Solar Page
**Skill:** `page-cro`
**What:** Same framework applied to `/industries/solar` — our first industry page.
**Why:** Before we templatize for 11 more industries, we want the template itself optimized for conversion. Fix it once, replicate 12 times.

### 5. Improve Industry Page Copy
**Skill:** `copywriting`
**What:** Run the solar page content through the copywriting skill's framework — check for benefit vs feature focus, specificity, customer language, CTA copy quality.
**Why:** Our current copy was written from SEO research. The copywriting skill adds a conversion layer — making sure every section advances a sales argument, not just provides information.

### 6. Validate Schema Markup
**Skill:** `schema-markup`
**What:** Audit the JSON-LD structured data on the solar page. Ensure it follows Google's guidelines, has all required properties, and enables rich results.
**Why:** We already embed schema via `IndustryData.seo.schema` — but it hasn't been validated against best practices.

### 7. Strengthen Programmatic SEO Strategy
**Skill:** `programmatic-seo`
**What:** Validate our industry page architecture against the pSEO framework — unique value per page, URL structure, internal linking, indexation strategy, quality checks.
**Why:** We're building 12 pages from a template. The skill has specific guidance on avoiding thin content penalties, ensuring each page has genuine unique value (not just variable swaps), and proper hub-and-spoke linking.
**Key insight from skill:** "Better to have 100 great pages than 10,000 thin ones." Our 12 pages need to be DEEP, not just template swaps.

---

## Phase 3: Growth (After Industry Pages Ship)

### 8. Competitor / Alternative Pages
**Skill:** `competitor-alternatives`
**What:** Build pages like `/vs/aurora-solar`, `/alternatives/opensolar`, etc.
**Why:** Vizzion's unique positioning (pre-lead vs post-lead) is a massive differentiator. Comparison pages capture high-intent search traffic from people already looking at competitors.
**Page types:**
- `vizzion.io/vs/aurora-solar` — "Vizzion vs Aurora Solar"
- `vizzion.io/alternatives/opensolar` — "OpenSolar Alternative"
- These are SEO gold for B2B SaaS.

### 9. Content Strategy
**Skill:** `content-strategy`
**What:** Plan blog/resource content around our 12 industries — searchable content (how-to guides, calculators, cost comparisons) and shareable content (case studies, data insights).
**Why:** Industry pages bring organic traffic. Blog content creates the topical authority that helps those pages rank.

### 10. Lead Form Optimization
**Skill:** `form-cro`
**What:** Optimize the widget's email capture flow. The Vizzion widget gates visualizations behind an email form — that form IS the conversion event. Every field, every label, every micro-interaction matters.
**Why:** This is literally the product's core conversion mechanism. Even a 5% improvement in form completion = 5% more leads for every customer.

### 11. Marketing Psychology Review
**Skill:** `marketing-psychology`
**What:** Apply behavioral frameworks to the overall site — Jobs to Be Done framing, loss aversion in copy ("every visitor who leaves without seeing your products is a lost opportunity"), social proof placement, progressive commitment in the widget flow.
**Why:** The skill has 70+ mental models. A targeted review would surface 5-10 specific psychological levers we're not pulling.

### 12. Email Sequences
**Skill:** `email-sequence`
**What:** Design the post-lead drip campaign — what happens after someone gives their email to the widget? Nurture sequence, follow-up timing, value delivery.
**Why:** Vizzion captures emails. What happens next determines whether those emails become customers. (This may be more relevant for Vizzion's customers than for vizzion.io itself, but could also inform how we nurture our OWN leads.)

---

## Skills We Probably Don't Need (Yet)

| Skill | Why Skip |
|---|---|
| `ab-test-setup` | No traffic to test yet — premature |
| `analytics-tracking` | Not set up yet, but will matter later |
| `paid-ads` | Not running ads yet |
| `popup-cro` | No popups planned |
| `signup-flow-cro` | Dashboard signup is separate from marketing site |
| `onboarding-cro` | Post-signup optimization — later |
| `paywall-upgrade-cro` | No paywall yet |
| `referral-program` | Way too early |
| `launch-strategy` | Useful when we actually launch |
| `social-content` | Not active on social yet |
| `free-tool-strategy` | Interesting future idea (free "see your home" tool?) but not now |
| `marketing-ideas` | General brainstorming — use as needed |
| `copy-editing` | Use after drafts, not as a standalone step |

---

## Recommended Install Order

```bash
# Step 1: Install priority skills
npx skills add coreyhaines31/marketingskills --skill product-marketing-context copywriting page-cro schema-markup seo-audit programmatic-seo

# Step 2: Install growth skills (when ready)
npx skills add coreyhaines31/marketingskills --skill competitor-alternatives content-strategy form-cro marketing-psychology email-sequence
```

---

## Biggest Single Win

**Create `.claude/product-marketing-context.md`** using the `product-marketing-context` skill framework. This is the keystone — every other skill checks for it. We already have the raw material:

- `discord-vizzion.md` — business understanding
- `vizzion-solar-seo-research.md` — competitor analysis, customer pain points
- `TEMPLATE-RULES.md` — brand voice rules
- The codebase itself — positioning, copy, features

One document. Every future marketing task starts smarter.
