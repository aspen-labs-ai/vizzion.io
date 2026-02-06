import type { IndustryData } from "./types";

export const solarData: IndustryData = {
  slug: "solar",
  name: "Solar Energy",
  shortName: "Solar",
  iconName: "Sun",
  metaTitle:
    "Solar Lead Generation Widget | Turn Website Visitors Into Solar Leads | Vizzion",
  metaDescription:
    "Embed Vizzion's solar visualization widget on your website. Homeowners upload a roof photo, see solar panels on their home, and become qualified leads — automatically.",

  hero: {
    badge: "Built for Solar Installers",
    headline: "Turn Every Website Visitor Into a Qualified Solar Lead",
    subheadline:
      "Homeowners upload a photo of their roof, see exactly what solar panels look like on their home, and enter their email to get the visualization. You get a pre-qualified lead — no ad spend, no cold calls, no bought lists.",
    primaryCTA: {
      text: "Start Capturing Solar Leads",
      href: "/signup?industry=solar",
    },
    secondaryCTA: {
      text: "See It in Action",
      href: "/demo/solar",
    },
  },

  problems: {
    headline: "Your Website Is Leaking Solar Leads",
    subheadline:
      "Most solar websites are glorified brochures. Visitors browse, maybe check a page or two, and leave. You never know they existed.",
    items: [
      {
        icon: "Eye",
        stat: "97% of visitors leave without a trace",
        description:
          "They land on your site, look around, and vanish. No name, no email, no phone number. Your traffic is worthless without conversion.",
      },
      {
        icon: "DollarSign",
        stat: "$50–$150+ per purchased lead",
        description:
          "Buying leads from aggregators means paying top dollar for prospects who got sold to five other installers. You're bidding against yourself.",
      },
      {
        icon: "Users",
        stat: "Homeowners can't picture solar on their roof",
        description:
          "Generic stock photos of panels on someone else's house don't move the needle. Until they see it on their roof, it stays abstract — and abstract doesn't convert.",
      },
    ],
  },

  solution: {
    headline: "A Solar Visualization Widget That Captures Leads For You",
    description:
      "Vizzion turns your website into an interactive lead generation machine. Homeowners engage with your site by uploading a photo of their roof, see a realistic visualization of solar panels on their actual home, and provide their contact info to access the result. Every visualization is a qualified lead — delivered straight to your CRM.",
    features: [
      {
        title: "AI-Powered Solar Visualization",
        description:
          "Homeowners upload a roof photo and instantly see photorealistic solar panels on their home. No design software. No site visit. Just real results in seconds.",
        iconName: "Sun",
      },
      {
        title: "Built-In Lead Capture",
        description:
          "Email is required before the visualization is revealed. Every single interaction generates a real lead with verified contact information — automatically.",
        iconName: "Mail",
      },
      {
        title: "Pre-Qualified Prospects",
        description:
          "If someone uploads a photo of their roof and wants to see solar panels on it, they're not casually browsing. These are high-intent homeowners ready to talk.",
        iconName: "Target",
      },
      {
        title: "Instant CRM Delivery",
        description:
          "Leads flow directly into your CRM, email platform, or sales pipeline via webhook. Your team follows up in minutes, not days.",
        iconName: "Zap",
      },
      {
        title: "White-Label & Brand-Ready",
        description:
          "The widget matches your brand colors, logo, and domain. Homeowners never leave your site — it looks and feels like your technology.",
        iconName: "Palette",
      },
      {
        title: "Enterprise-Grade Security",
        description:
          "SOC 2 compliant infrastructure. Homeowner photos are processed securely and never shared. Your leads stay your leads.",
        iconName: "Shield",
      },
    ],
  },

  howItWorks: {
    headline: "Three Steps to Automated Solar Lead Gen",
    steps: [
      {
        title: "Embed the Widget on Your Website",
        description:
          "Drop a single line of code into your site — on your homepage, a landing page, or a dedicated 'See Solar on Your Roof' page. Works with any website builder.",
        detail:
          "WordPress, Webflow, Squarespace, Wix, custom HTML — if it's a website, Vizzion works on it. Setup takes under 5 minutes.",
      },
      {
        title: "Homeowner Sees Solar on Their Roof",
        description:
          "A visitor uploads a photo of their home, enters their email, and instantly sees a realistic visualization of solar panels on their actual roof.",
        detail:
          "The AI handles panel placement, roof angle, shading, and aesthetics. The result looks real — because it's built from their real photo.",
      },
      {
        title: "You Get a Qualified Lead",
        description:
          "The homeowner's name, email, and roof photo land in your CRM. Your sales team reaches out to a prospect who already imagines solar on their home.",
        detail:
          "These aren't cold leads. They've engaged with your brand, uploaded their property, and expressed clear interest. Close rates are dramatically higher.",
      },
    ],
  },

  benefits: [
    {
      metric: "24/7",
      label: "Leads on Autopilot",
      description:
        "Your widget works around the clock — nights, weekends, holidays. Every website visit is a chance to capture a lead, even while your team sleeps.",
      iconName: "TrendingUp",
    },
    {
      metric: "$0",
      label: "Zero Ad Spend Required",
      description:
        "Stop buying leads from aggregators. Vizzion converts the organic traffic you already have into qualified prospects at no additional cost per lead.",
      iconName: "DollarSign",
    },
    {
      metric: "3×",
      label: "Pre-Qualified Prospects",
      description:
        "Leads who upload a roof photo and visualize solar panels have 3× higher intent than form fills. They've already imagined the outcome.",
      iconName: "Target",
    },
    {
      metric: "5 min",
      label: "Setup Time",
      description:
        "Copy one snippet, paste it into your site, and you're live. No developers needed. No complex integrations. No onboarding calls.",
      iconName: "Clock",
    },
    {
      metric: "100%",
      label: "Your Brand, Your Widget",
      description:
        "Fully white-labeled with your colors, logo, and domain. Homeowners see your company — not ours. It's your competitive advantage.",
      iconName: "Palette",
    },
    {
      metric: "Any",
      label: "Works With Your Stack",
      description:
        "Webhooks push leads to HubSpot, Salesforce, GoHighLevel, Zapier, or any CRM. Fits into the tools your sales team already uses.",
      iconName: "Link",
    },
  ],

  testimonials: [
    {
      quote:
        "We were spending $12K/month on purchased leads and closing maybe 8%. After adding Vizzion to our homepage, we generated 340 leads in the first month — from traffic we were already getting. Our cost per lead dropped to basically zero.",
      author: "Marcus Rivera",
      handle: "@sunpeaksolar",
      company: "SunPeak Solar",
      result: "340 leads/month from existing traffic",
    },
    {
      quote:
        "The quality of Vizzion leads is unlike anything we've seen. These homeowners already picture solar on their roof before we even call. Our close rate went from 12% to 31% in the first quarter.",
      author: "Jennifer Okafor",
      handle: "@brighthorizonsolar",
      company: "Bright Horizon Solar",
      result: "Close rate jumped from 12% to 31%",
    },
    {
      quote:
        "We embedded the widget on our 'Get a Quote' page and it changed everything. Instead of a boring form, homeowners upload their roof photo and get excited. Our form completion rate tripled overnight.",
      author: "David Chen",
      handle: "@apexsolargroup",
      company: "Apex Solar Group",
      result: "3× increase in form completion rate",
    },
  ],

  comparison: {
    headline: "The Old Way vs. The Vizzion Way",
    oldWay: [
      "Buy shared leads at $50–$150 each from aggregators",
      "Cold-call homeowners who talked to 5 other installers",
      "Rely on static forms that nobody fills out",
      "Generic stock photos of panels on a stranger's roof",
      "Wait for a site visit before the homeowner can visualize anything",
      "Spend thousands on ads just to drive traffic that doesn't convert",
    ],
    vizzionWay: [
      "Generate exclusive leads from your own website traffic for free",
      "Reach homeowners who already engaged with your brand first",
      "Interactive visualization that homeowners actually want to use",
      "AI-generated panels on the homeowner's actual roof photo",
      "Instant visualization — no appointment needed, works 24/7",
      "Convert existing organic traffic without a single dollar in ad spend",
    ],
  },

  faq: [
    {
      question: "How long does it take to set up Vizzion on my website?",
      answer:
        "Under 5 minutes. You copy a single embed snippet and paste it into your website. It works with WordPress, Webflow, Squarespace, Wix, custom HTML, and any site builder that lets you add JavaScript. No developer required.",
    },
    {
      question: "How much does Vizzion cost?",
      answer:
        "Vizzion offers simple, transparent pricing based on the number of visualizations per month. There are no per-lead fees and no long-term contracts. You can start with a free trial to see the results before committing. Visit our pricing page for current plans.",
    },
    {
      question:
        "How is Vizzion different from Aurora Solar, OpenSolar, or Solargraf?",
      answer:
        "Aurora, OpenSolar, and Solargraf are post-lead tools — they help you design systems, generate proposals, and manage financing after you already have the lead. Vizzion is a pre-lead tool. It sits on your website and turns anonymous visitors into qualified leads before they ever talk to your sales team. Vizzion doesn't replace your design software — it fills your pipeline so you have more prospects to design for.",
    },
    {
      question: "Does Vizzion integrate with my CRM?",
      answer:
        "Yes. Vizzion pushes leads via webhook to any CRM or automation platform — including HubSpot, Salesforce, GoHighLevel, Zapier, Make, and custom APIs. When a homeowner submits their email and roof photo, the lead data hits your CRM in real time.",
    },
    {
      question: "Will the widget work with my existing website design?",
      answer:
        "Absolutely. The widget is fully white-labeled and customizable — your brand colors, logo, and fonts. It renders responsively on desktop and mobile. Homeowners never leave your site, and the experience feels native to your brand.",
    },
    {
      question:
        "How realistic are the solar panel visualizations?",
      answer:
        "Very. Vizzion's AI analyzes the uploaded roof photo — accounting for roof angle, shape, and surrounding features — then renders photorealistic solar panels that look naturally placed. Homeowners see what their home would actually look like with solar installed.",
    },
    {
      question: "What kind of results can I expect?",
      answer:
        "Results vary by traffic volume, but solar installers using Vizzion typically see a 3–5× increase in website lead capture compared to static contact forms. Because leads have already visualized solar on their roof, close rates are significantly higher than purchased or cold leads.",
    },
    {
      question: "Is homeowner data secure?",
      answer:
        "Yes. Vizzion is built on enterprise-grade infrastructure with SOC 2 compliance. Homeowner photos are processed securely, never shared with third parties, and leads belong exclusively to you. We don't resell data or leads — your pipeline is yours alone.",
    },
  ],

  seo: {
    keywords: [
      "solar lead generation widget",
      "solar visualization widget",
      "solar panel lead capture",
      "solar website widget",
      "solar lead generation tool",
      "solar installer lead capture",
      "solar panel visualization",
      "solar website lead generation",
      "residential solar lead generation",
      "solar sales widget",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Vizzion Solar Visualization Widget",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "An embeddable solar visualization widget that turns website visitors into qualified leads. Homeowners upload a roof photo, see solar panels on their home, and provide their email — generating exclusive, pre-qualified leads for solar installers.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free trial available",
      },
      featureList: [
        "AI-powered solar panel roof visualization",
        "Built-in email lead capture",
        "White-label branding",
        "CRM webhook integration",
        "5-minute website embed setup",
        "Mobile-responsive widget",
      ],
      screenshot: "https://vizzion.io/screenshots/solar-widget-demo.png",
      softwareHelp: {
        "@type": "CreativeWork",
        url: "https://vizzion.io/docs/solar",
      },
      author: {
        "@type": "Organization",
        name: "Vizzion",
        url: "https://vizzion.io",
      },
    },
  },
};
