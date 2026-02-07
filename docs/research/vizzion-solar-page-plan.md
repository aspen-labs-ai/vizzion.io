# Vizzion.io — Solar Industry Landing Page Plan

**Date:** February 6, 2026  
**Status:** ✅ COMPLETED — Solar page is LIVE at `/industries/solar`  
**Last Updated:** February 7, 2026  
**Target URL:** `/industries/solar`

---

> **📌 This plan has been fully executed.** The solar page was the first industry page built and has been through multiple iterations. It established the template pattern now used by all 17 industry pages. The `IndustryData` interface, shared components, and data-driven architecture described below are all implemented and proven. 6 industry pages are live; 11 more to build using this same pattern.

---

## A. Page Architecture

### URL Structure
```
/industries/solar          ← LIVE (first page built)
/industries/car-wraps      ← LIVE
/industries/tattoos        ← LIVE
/industries/swimming-pools ← LIVE
/industries/artificial-turf← LIVE
/industries/boat-decking   ← LIVE
/industries/[slug]         ← Dynamic route for all 17 industries
```

### File Structure (New Files)
```
app/
  industries/
    layout.tsx                    ← Shared layout for all industry pages
    [slug]/
      page.tsx                    ← Dynamic industry page (data-driven)
    solar/
      page.tsx                    ← Optional: custom solar page (override)

components/
  industries/
    IndustryHero.tsx              ← Hero with industry-specific content
    IndustryProblem.tsx           ← Pain points section
    IndustrySolution.tsx          ← How Vizzion solves it
    IndustryHowItWorks.tsx        ← 3-step process (adapts existing ThreeSteps)
    IndustryBenefits.tsx          ← ROI/metrics section
    IndustryTestimonials.tsx      ← Industry-filtered testimonials
    IndustryComparison.tsx        ← "Old Way vs Vizzion" comparison
    IndustryFAQ.tsx               ← FAQ with schema markup
    IndustryCTA.tsx               ← Bottom conversion section
    IndustryDemo.tsx              ← Interactive demo/video embed

data/
  industries/
    solar.ts                      ← Solar-specific content & data
    roofing.ts                    ← Future
    index.ts                      ← Industry data types + exports
```

### Data Model (Template for All 12 Industries)
```typescript
interface IndustryData {
  slug: string;
  name: string;                    // "Solar Panels"
  shortName: string;               // "Solar"
  icon: LucideIcon;                // Sun
  metaTitle: string;
  metaDescription: string;
  
  hero: {
    badge: string;                 // "Solar Lead Generation"
    headline: string;
    subheadline: string;
    primaryCTA: { text: string; href: string };
    secondaryCTA: { text: string; href: string };
    heroImage: string;             // or video URL
  };
  
  problems: {
    headline: string;
    subheadline: string;
    items: Array<{
      icon: string;
      stat: string;
      description: string;
    }>;
  };
  
  solution: {
    headline: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
      icon: LucideIcon;
    }>;
  };
  
  howItWorks: {
    headline: string;
    steps: Array<{
      title: string;
      description: string;
      detail: string;
    }>;
  };
  
  benefits: Array<{
    metric: string;                // "10x"
    label: string;                 // "More Leads"
    description: string;
  }>;
  
  testimonials: Array<{
    quote: string;
    author: string;
    company: string;
    result: string;                // "47 leads/month"
  }>;
  
  comparison: {
    oldWay: string[];
    vizzionWay: string[];
  };
  
  faq: Array<{
    question: string;
    answer: string;
  }>;
  
  seo: {
    keywords: string[];
    schema: object;                // JSON-LD structured data
  };
}
```

---

## B. Section-by-Section Breakdown

### Section 1: Industry Hero
**Purpose:** Capture attention, communicate solar-specific value prop

**Content:**
- **Badge:** "Solar Lead Generation"
- **H1:** "Turn Every Website Visitor Into a Qualified Solar Lead"
- **Subheadline:** "Homeowners upload a photo of their roof. They see solar panels on their actual home. You get their email before the visualization loads. Every visit becomes a lead."
- **Primary CTA:** "See It In Action" → scrolls to demo section
- **Secondary CTA:** "Watch 30-Second Demo" → video modal
- **Visual:** Split — left text, right animated widget mockup showing a house → solar panels appearing on roof → email capture form

**Design Notes:**
- Reuse existing Hero component's grid layout (2-column on desktop)
- Reuse ParticlesBackground for visual consistency
- Solar-specific: warm amber/yellow accent hints (sun energy) while keeping the emerald green primary accent

### Section 2: Social Proof Bar
**Purpose:** Instant credibility

**Content:**
- "Trusted by [X]+ solar companies across [X] states"
- Stats: "[X] leads captured | [X]% avg conversion lift | 5-minute setup"
- Logo bar (placeholder for now, real logos later)

**Design Notes:**
- Reuse existing SocialProof component pattern
- Emerald checkmarks, subtle animation on scroll

### Section 3: Problem Statement
**Purpose:** Resonate with solar company pain points (from SEO research)

**Content:**
- **H2:** "Your Website Gets Traffic. But Where Are the Solar Leads?"
- **3 pain cards:**
  1. 📉 **"97% leave without a trace"** — "Your website visitors are curious about solar, but a contact form isn't enough to capture their interest."
  2. 💸 **"$50+ per bought lead"** — "Third-party lead vendors send shared, low-quality leads that your sales team wastes time chasing."
  3. 🏠 **"They can't picture it"** — "Homeowners want solar but can't visualize panels on THEIR roof. The uncertainty kills the sale."

**Design Notes:**
- New component: IndustryProblem
- Dark cards with icons, stat numbers in accent color
- Subtle red/warning tones for pain emphasis

### Section 4: Solution Overview
**Purpose:** Position Vizzion as the answer, specifically for solar

**Content:**
- **H2:** "The Missing Piece in Your Solar Sales Stack"
- **Key message:** "Every solar tool focuses on what happens AFTER you get a lead — proposals, designs, financing. Vizzion is the only tool that helps you GET the lead in the first place."
- **Positioning visual:** Simple diagram or side-by-side:
  - Aurora, OpenSolar, Solargraf = "Post-lead tools" (design, proposal, finance)
  - Vizzion = "Pre-lead tool" (website visitor → qualified lead)
- **Tagline:** "Works alongside your existing stack. Fills the gap before it."

**Design Notes:**
- Clean, focused section
- Possibly a horizontal flow diagram
- Accent-colored connection between "Vizzion" → "Your Existing Tools"

### Section 5: How It Works (Solar-Specific)
**Purpose:** Demystify the product, show simplicity

**Content:**
- **H2:** "How It Works for Solar Companies"
- **Step 1: "Embed the Widget"**
  - "Copy-paste one line of code onto your website. Works with any platform — WordPress, Wix, custom sites. Takes 5 minutes."
  - Visual: Code snippet preview (reuse existing EmbedCodePreview component)
  
- **Step 2: "Homeowner Sees Solar on Their Roof"**
  - "A visitor uploads a photo of their home. Vizzion instantly shows what solar panels look like on their actual roof — different layouts, panel counts, and configurations."
  - Visual: Before/after of house with/without solar panels
  
- **Step 3: "You Get a Qualified Lead"**
  - "Before seeing the visualization, the homeowner enters their email. You get notified instantly — name, email, and which solar configuration they chose."
  - Visual: Email notification / lead card mockup

**Design Notes:**
- Adapt existing ThreeSteps component structure (3-column grid)
- Keep the same card style with icons, description, and bullet points
- Add solar-specific imagery

### Section 6: Benefits / ROI
**Purpose:** Translate features into business outcomes solar companies care about

**Content:**
- **H2:** "Why Solar Companies Choose Vizzion"
- **Benefit cards (6):**
  1. ⚡ **"Leads on Autopilot"** — Capture qualified leads 24/7, even at 2 AM on a Sunday. No rep needed.
  2. 💰 **"Zero Ad Spend"** — Generate leads from your existing website traffic. Stop paying $50+ per shared lead.
  3. 🎯 **"Pre-Qualified Prospects"** — Every lead has already seen solar on their roof and shared their email. They're warm and ready.
  4. ⏱️ **"5-Minute Setup"** — One line of code. No developers, no IT department, no waiting.
  5. 🎨 **"Your Brand, Your Widget"** — Fully customizable colors, logos, and messaging. Matches your site perfectly.
  6. 🔗 **"Works With Your Stack"** — Integrates with your CRM, Aurora, OpenSolar, or any tool you already use.

**Design Notes:**
- 2x3 or 3x2 grid of benefit cards
- Icon + heading + 1-2 sentence description
- Reuse existing card patterns from Industries component

### Section 7: Interactive Demo / Video
**Purpose:** Let prospects experience or see the product

**Content:**
- **H2:** "See Vizzion in Action"
- **Primary:** Embedded live demo widget (if technically feasible)
- **Alternative:** 30-60 second product video showing the solar flow
- **Caption:** "This is exactly what your website visitors will experience."
- **CTA below:** "Ready to add this to your site?"

**Design Notes:**
- Full-width section with centered content
- If video: 16:9 aspect ratio, poster frame with play button
- Subtle glow/border animation to draw attention

### Section 8: Old Way vs Vizzion
**Purpose:** Address objections, differentiate from status quo

**Content:**
- **H2:** "Stop Chasing Leads. Start Attracting Them."
- **Side-by-side comparison:**

| The Old Way | With Vizzion |
|---|---|
| Buy shared leads from vendors | Generate your own exclusive leads |
| $50+ per lead, 5% close rate | $0 marginal cost, leads from YOUR traffic |
| Static contact form on website | Interactive visualization that engages |
| Wait for phone calls | Capture emails automatically, 24/7 |
| Homeowners can't picture solar | They SEE solar on their actual roof |
| Compete with 5+ other companies per lead | You're the ONLY company they're talking to |

**Design Notes:**
- Two-column layout: gray/muted left, accent-highlighted right
- Checkmarks on Vizzion side, X marks on old way
- Mobile: stacked cards

### Section 9: Testimonials (Solar-Specific)
**Purpose:** Peer validation from solar companies

**Content:**
- **H2:** "Real Results From Solar Companies"
- Solar-specific testimonials (placeholder content until real customers):
  1. "We went from 3 website leads per month to 47. Vizzion pays for itself in the first week." — Owner, SunPower Installations
  2. "Our competitors are still using contact forms. We're capturing 10x more leads with the visualization widget." — Marketing Dir, Apex Solar
  3. "Speed to lead is everything in solar. Vizzion gets us engaged with homeowners the moment they're interested." — Sales Manager, Coastal Solar Co

**Design Notes:**
- Reuse existing Testimonials component (masonry grid)
- Filter to show only solar testimonials on this page
- Add specific result metrics to each

### Section 10: FAQ
**Purpose:** Handle remaining objections, capture featured snippets

**Content:**
- **H2:** "Frequently Asked Questions"
- **Questions (with FAQPage schema markup):**
  1. "How long does setup take?" → "About 5 minutes..."
  2. "Does it work with my existing website?" → "Yes. WordPress, Wix, Squarespace..."
  3. "How much does it cost?" → "Plans start at $49/month..."
  4. "What kind of leads will I get?" → "Every lead has uploaded a photo of their home..."
  5. "Can I customize the look and feel?" → "Fully customizable..."
  6. "Does it integrate with my CRM?" → "Yes. Connect to any CRM..."
  7. "How is this different from Aurora Solar?" → "Vizzion isn't a replacement for design tools..."
  8. "What if a homeowner uploads a bad photo?" → "Our AI handles various photo qualities..."

**Design Notes:**
- Accordion-style FAQ
- Schema markup for Google featured snippets
- New component: IndustryFAQ

### Section 11: Final CTA
**Purpose:** Convert remaining interest

**Content:**
- **H2:** "Ready to Turn Your Website Into a Lead Machine?"
- **Sub:** "Join solar companies already generating more leads with Vizzion."
- **CTA:** "Start Your Free Trial" (large, centered button)
- **Microcopy:** "No credit card required. Set up in under 5 minutes."

**Design Notes:**
- Full-width accent background section
- Reuse SignupSection patterns
- Email capture form inline

---

## C. Content Strategy

### SEO
- **Title tag:** "Solar Panel Visualization Widget for Lead Generation | Vizzion"
- **Meta description:** "Embed Vizzion's solar visualization widget on your website. Homeowners see panels on their roof — you capture their email. Turn every visitor into a lead."
- **Target keywords:** "solar lead generation widget," "solar visualization widget," "solar lead capture"
- **Schema markup:** SoftwareApplication, FAQPage, HowTo, BreadcrumbList, Organization
- **Content length:** 2,500+ words across all sections
- **H1:** Single, keyword-rich ("Turn Every Website Visitor Into a Qualified Solar Lead")

### Visual Needs
1. Hero mockup: House with solar panels appearing (animation or static)
2. Before/after comparison images
3. Widget screenshot showing solar flow
4. Solar company logo placeholders
5. Testimonial author avatars
6. Icons for benefits (can use Lucide React)
7. Comparison section icons/illustrations

### Interactive Elements
- Floating/sticky CTA on scroll
- Smooth scroll between sections
- FAQ accordion
- Optional: Live widget demo embed
- Animated stats on scroll-into-view

---

## D. Technical Approach

### Component Reusability
Every component is data-driven via the `IndustryData` interface. To add a new industry:
1. Create `data/industries/roofing.ts` with the data
2. Add the slug to the routing
3. Done — same components, different content

### Performance
- Server-side rendered (Next.js App Router)
- Lazy load below-fold sections
- WebP images with responsive srcsets
- Async widget embed (zero impact on page speed)
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1

### Routing Strategy
- Start with `/industries/solar/page.tsx` as a static route
- Once pattern is proven, migrate to `[slug]` dynamic route
- All 12 industries use the same component library

---

## E. Reuse vs Build New

### Reuse (Adapt Existing)
| Component | Reuse As | Changes Needed |
|---|---|---|
| Hero.tsx | IndustryHero.tsx | Accept industry data props, keep grid layout |
| ThreeSteps.tsx | IndustryHowItWorks.tsx | Accept step data as props, keep card style |
| Testimonials.tsx | IndustryTestimonials.tsx | Filter by industry, same masonry layout |
| SocialProof.tsx | (direct reuse) | Add industry-specific stats |
| SignupSection.tsx | IndustryCTA.tsx | Adapt copy, keep form structure |
| EmbedCodePreview.tsx | (direct reuse in How It Works) | No changes |
| Header.tsx | (direct reuse) | No changes |
| Footer.tsx | (direct reuse) | No changes |

### Build New
| Component | Purpose |
|---|---|
| IndustryProblem.tsx | Pain point cards (3-up grid) |
| IndustrySolution.tsx | Positioning / differentiation section |
| IndustryBenefits.tsx | 6-card benefit grid with metrics |
| IndustryComparison.tsx | Old Way vs Vizzion side-by-side |
| IndustryFAQ.tsx | Accordion with schema markup |
| IndustryDemo.tsx | Video/live demo embed section |
| data/industries/solar.ts | All solar-specific content |
| data/industries/index.ts | TypeScript types + industry registry |

---

## Summary

**Estimated new files:** ~12  
**Estimated components:** 6 new, 5 adapted, 3 direct reuse  
**Total sections:** 11  
**Content approach:** Data-driven template — build once, reuse for all 12 industries  
**Build order:** Solar first (prove the pattern) ✅, then templatize for remaining 16 — 5 more live, 11 to go
