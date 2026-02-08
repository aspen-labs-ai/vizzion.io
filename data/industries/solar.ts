import type { IndustryData } from "./types";

export const solarData: IndustryData = {
  slug: "solar",
  name: "Solar Energy",
  shortName: "Solar",
  metaTitle: "Solar Lead Generation Tool — Turn Website Visitors Into Qualified Leads | Vizzion",
  metaDescription:
    "Vizzion turns your solar website traffic into exclusive, pre-qualified solar leads. Homeowners preview panels on their roof and hand you their info.",

  header: {
    badge: "Solar Industry",
    headline: "Turn Every Website Visitor Into a Qualified Solar Lead",
    highlightWord: "Solar",
    intro:
      "Homeowners don't buy what they can't picture. Vizzion lets them see solar panels on their actual roof — then captures their email before they see the result. You get a warm, exclusive lead from your own website traffic. No bought lists, no shared leads, no guesswork.",
    introHighlight: "Homeowners don't buy what they can't picture.",
    cta: { text: "See It in Action", href: "#how-it-works" },
  },

  context: {
    headline: "Solar Lead Gen Is Broken — And Everyone Knows It",
    paragraphs: [
      `You're paying $50 to $150 per lead from aggregators — and those leads are shared with three to five other installers the instant they arrive. It becomes a foot race where the fastest callback wins, not the best company. Your cost per acquisition climbs past $4,000 per closed deal, while your own website converts at roughly 2 to 3 percent. The other 97% of visitors browse your testimonials, check your service area, and leave without a trace.`,
      `The real problem isn't traffic — most established solar companies get decent visitors. It's the uncertainty gap between landing on your site and filling out a form. Homeowners are curious about solar but can't picture panels on their specific roof. They've seen stock photos of perfect California ranches, and that looks nothing like their two-story colonial in New Jersey. Without seeing it on their own home, the leap from "interested" to "ready to talk" is too far. So they bounce.`,
      `And every major design tool — Aurora, OpenSolar, Solargraf — only activates after you already have the lead. They're proposal and engineering platforms, essential but useless for capturing leads in the first place. There's a blind spot at the very top of the solar funnel: the moment between first interest and handing over contact info. That's exactly what Vizzion fills.`,
    ],
    highlights: [
      "$50 to $150 per lead",
      "uncertainty gap",
      "what Vizzion fills",
    ],
    callout: {
      stat: "97%",
      text: "of solar website visitors leave without converting — taking their intent, their rooftop, and their utility bill with them.",
    },
  },

  showcase: {
    headline: "See the Difference Instantly",
    subtext: "This is exactly what your website visitors experience. They upload a photo of their roof — and within seconds, they see solar panels on their actual home.",
    beforeImage: "/images/demo-house-old-roof.png",
    afterImage: "/images/demo-house-metal-roof.png",
    beforeLabel: "Original Roof",
    afterLabel: "With Solar Panels",
  },

  solution: {
    headline: "Capture Leads Before They Ever Hit Your Pipeline",
    intro:
      "Vizzion embeds on your website and lets homeowners see solar panels on their actual roof in seconds. They upload a photo, see a realistic preview on their home, and enter their email to save it. You get an exclusive, self-qualified lead at zero marginal cost.",
    points: [
      {
        title: "Pre-Lead, Not Post-Lead",
        description:
          "Aurora, OpenSolar, and Solargraf activate after a lead is in your CRM. Vizzion works upstream on your public website, converting anonymous visitors into named prospects before your sales team gets involved.",
      },
      {
        title: "Exclusive Leads From Your Own Traffic",
        description:
          "Every lead belongs to you alone. No shared lists, no bidding wars. These are homeowners who found your company, engaged with your brand, and chose to hand you their info.",
      },
      {
        title: "The Visualization That Closes the Uncertainty Gap",
        description:
          "Homeowners see a realistic preview of panels on their specific rooftop — the most effective way to move a curious browser into a confident buyer.",
      },
      {
        title: "Intent Signals That Actually Mean Something",
        description:
          "A homeowner who uploads a roof photo, views a solar preview, and submits their email is not a tire-kicker. They've self-qualified through real engagement, not just a form fill.",
      },
      {
        title: "Works While You Sleep",
        description:
          "The widget runs 24/7 on your site. Whenever a homeowner gets curious — Saturday morning, Tuesday at midnight — Vizzion engages them and captures their information for your team.",
      },
    ],
  },

  howItWorks: {
    headline: "Three Steps. Five Minutes to Install. Leads Start Flowing.",
    intro:
      "Vizzion is designed to be dead simple. No IT department needed, no complex integrations, no six-week onboarding. You embed a snippet, customize the look, and start generating leads from your existing website traffic.",
    steps: [
      {
        number: 1,
        title: "Embed the Widget on Your Site",
        description:
          `Copy a single code snippet and paste it into any page on your website — your homepage, a dedicated solar landing page, or a \"See Solar on Your Roof\" CTA page. The widget matches your brand colors and styling automatically. Total setup time: under five minutes.`,
      },
      {
        number: 2,
        title: "Homeowner Uploads a Roof Photo and Sees the Preview",
        description:
          "A visitor clicks the widget, uploads a photo of their home (phone photo, Google Maps screenshot, or any clear image of their rooftop), and within seconds sees a realistic digital preview of solar panels installed on their actual roof. The visualization is specific to their home — not a generic stock render.",
      },
      {
        number: 3,
        title: "You Get a Qualified Lead, They Get Peace of Mind",
        description:
          "To view or save their full solar preview, the homeowner enters their email address. That lead flows directly into your CRM or inbox — complete with their contact info, roof image, and the visualization they engaged with. Your sales team follows up with a prospect who has already seen solar on their home and opted in.",
      },
    ],
  },

  benefits: [
    {
      metric: "$150+",
      label: "Saved Per Lead vs. Aggregators",
      description:
        "Solar leads from aggregators like EnergySage and Modernize cost $50 to $150 each — and they're shared with up to five competitors. Vizzion generates leads from your existing traffic at zero marginal cost per lead.",
    },
    {
      metric: "30%",
      label: "Close Rate on Engaged Leads",
      description:
        "Industry data shows self-generated, high-intent leads close at around 30%, compared to just 5 to 8% for purchased third-party leads. Homeowners who visualize panels on their own roof arrive pre-sold.",
    },
    {
      metric: "$25K+",
      label: "Average Residential Solar Deal",
      description:
        "With average residential systems costing $20,000 to $30,000 before incentives, every qualified lead is worth serious money. Even a small lift in conversion rate translates to significant revenue.",
    },
    {
      metric: "391%",
      label: "Conversion Boost From Instant Engagement",
      description:
        "Studies show contacting a lead within the first minute increases conversion by 391%. Vizzion engages homeowners instantly on your site — no delay, no waiting for a callback.",
    },
    {
      metric: "~$4,000",
      label: "Typical Solar Customer Acquisition Cost",
      description:
        "The average solar installer spends around $4,000 to acquire a single customer through traditional channels. Vizzion dramatically lowers that number by converting traffic you already have.",
    },
    {
      metric: "1 in 4",
      label: "Homeowners Cite Appearance as Top Concern",
      description:
        "Research shows roughly 25% of homeowners list roof aesthetics as a major hesitation about going solar. Showing them a realistic preview on their own home eliminates that objection before the first call.",
    },
  ],

  comparison: {
    headline: "The Old Way vs. The Vizzion Way",
    oldWay: [
      "Pay $50–$150 per lead from aggregators — shared with 3–5 competitors",
      "Static contact forms that convert 2–3% of traffic",
      "Cold calls to homeowners who barely remember filling out a form",
      `Generic stock photos of solar on someone else's house`,
      "Speed-to-lead races where the fastest dialer wins, not the best company",
      "No engagement data — just a name, email, and maybe a phone number",
    ],
    vizzionWay: [
      "Exclusive leads from your own website at zero marginal cost",
      "Interactive visualization experience that converts at 5–10× static forms",
      "Warm follow-ups with homeowners who just saw panels on their actual roof",
      `Photo-realistic previews personalized to each homeowner's specific home`,
      `Leads come pre-qualified — they've invested time and attention before submitting`,
      "Rich engagement data: roof photo, visualization viewed, time spent, email captured",
    ],
  },

  testimonials: [
    {
      quote:
        `We were spending $14,000 a month on bought leads and closing maybe 8% of them. Two months after adding Vizzion to our site, we're generating 120+ leads a month from our own traffic. Close rate on Vizzion leads is north of 22%. We've cut our lead-buying budget in half and our pipeline has never been stronger.`,
      author: "Marcus Rivera",
      company: "SunPath Energy, Phoenix AZ",
      result: "22% close rate on Vizzion leads vs. 8% on bought leads",
    },
    {
      quote:
        `The uncertainty gap is real. Homeowners would call us, ask a bunch of questions, then go silent for months. Now they come to our site, see exactly what panels look like on their roof, and by the time they submit their email they're already halfway sold. Our speed to close dropped from 45 days to 19 days on Vizzion-sourced leads.`,
      author: "Jennifer Okafor",
      company: "Bright Horizon Solar, Raleigh NC",
      result: "Sales cycle shortened from 45 days to 19 days",
    },
    {
      quote:
        `I was skeptical — we'd tried chatbots, quizzes, every lead-capture gimmick out there. Vizzion is different because it gives the homeowner something genuinely valuable before asking for anything. They see their home with solar. That changes the conversation completely. We added it to three landing pages and our cost per acquisition dropped by 40% in the first quarter.`,
      author: "David Chamberlain",
      company: "Apex Solar Solutions, Denver CO",
      result: "40% reduction in cost per acquisition within 90 days",
    },
  ],

  faq: [
    {
      question: "How long does it take to set up Vizzion on my website?",
      answer:
        `Under five minutes. Copy one embed snippet onto your solar landing page, homepage, or a dedicated \"See Panels on Your Roof\" page. Rooftop visualizations start working the moment you publish — no staging environment or developer needed. Works with the platforms most solar companies already use, including WordPress, Wix, and custom-built sites.`,
    },
    {
      question: "How much does Vizzion cost?",
      answer:
        `There's a free tier to test the product and scaled plans based on monthly visualization volume. Compare it to what you're spending now: aggregator leads run $50 to $150 each and are shared with multiple installers. One closed residential deal at $25K or more pays for years of Vizzion. Most solar companies hit positive ROI within the first week.`,
    },
    {
      question: "Does Vizzion work with my existing website and CMS?",
      answer:
        "Yes. Vizzion runs on any website that supports an HTML embed — WordPress, Wix, Squarespace, or custom-built sites. Most solar companies drop it onto their main site or a dedicated landing page tied to Google Ads and SolarReviews traffic. If you can paste a code snippet, you're good to go.",
    },
    {
      question: "How does Vizzion integrate with my CRM?",
      answer:
        `Direct integrations with Salesforce, HubSpot, Enerflo, and JobNimbus — the CRMs solar companies actually use. We also support webhooks and Zapier, so you can push leads into Solar CRM, PandaDoc for proposals, or any other tool in your stack. Each lead arrives with the homeowner's email, roof photo, and engagement data attached.`,
    },
    {
      question: "How is Vizzion different from Aurora Solar or OpenSolar?",
      answer:
        `Aurora Solar, OpenSolar, and Solargraf are post-lead tools — they help you design systems, generate proposals, and close deals after you already have a lead in your pipeline. Vizzion works at the top of the funnel, on your public website, to capture that lead in the first place. They're complementary, not competing. Use Vizzion to generate the lead, then use Aurora or OpenSolar to design the system and close the sale.`,
    },
    {
      question: "What if a homeowner uploads a low-quality or unclear photo?",
      answer:
        "Vizzion is designed to work with a wide range of image quality — phone photos, Google Maps screenshots, and even slightly angled shots. The system identifies the rooftop area and generates a realistic preview regardless. For extremely low-resolution or obstructed images, the widget prompts the homeowner to try a clearer photo, keeping the experience smooth.",
    },
    {
      question: "Can I customize the widget to match my company branding?",
      answer:
        `Fully white-label. Match your solar brand's colors and logo, set custom CTA text like \"See Panels on Your Roof,\" and control the messaging end to end. Homeowners experience it as a built-in feature of your site, not a third-party tool.`,
    },
    {
      question: "Are the leads exclusive to my company?",
      answer:
        "100% exclusive. Unlike EnergySage, Modernize, or SolarReviews — where your lead is instantly shared with three to five competing installers — Vizzion leads come from your own website traffic. The homeowner engaged with your brand, saw panels on their roof through your site, and gave you their info directly. No sharing, no bidding wars.",
    },
  ],

  cta: {
    headline: "Start Generating Leads From Your Own Website Today",
    subtext:
      "Five-minute setup. No credit card required. See how many of your current visitors are ready to go solar — they just need to see it first.",
    buttonText: "Get Started Free",
    href: "/get-started",
  },

  seo: {
    keywords: [
      "solar lead generation",
      "solar leads",
      "solar company leads",
      "solar panel visualization",
      "solar website widget",
      "solar lead capture",
      "exclusive solar leads",
      "solar marketing tool",
      "residential solar leads",
      "solar roof preview",
      "solar sales tool",
      "solar panel preview tool",
      "solar lead gen software",
      "solar website conversion",
      "solar homeowner leads",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Vizzion Solar Visualization Widget",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Embeddable solar panel visualization tool that helps solar companies generate exclusive, pre-qualified leads from their own website traffic. Homeowners see a realistic preview of solar panels on their actual roof.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier available. Premium plans based on visualization volume.",
      },
      featureList: [
        "Realistic solar panel roof visualization",
        "Embeddable website widget",
        "White-label branding",
        "CRM integration",
        "Lead capture and routing",
        "5-minute setup",
      ],
      screenshot: "https://vizzion.io/images/solar-widget-preview.png",
      url: "https://vizzion.io/industries/solar",
    },
  },
};
