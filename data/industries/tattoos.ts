import type { IndustryData } from "./types";

export const tattoosData: IndustryData = {
  slug: "tattoos",
  name: "Tattoo Studios",
  shortName: "Tattoos",
  metaTitle: "Tattoo Visualization Widget for Lead Generation | Vizzion",
  metaDescription:
    "Tattoo preview visualization for studios. Clients see your designs on their actual skin before booking — reducing no-shows and turning browsers into committed leads.",

  lastUpdated: "February 15, 2026",
  evidenceNotes: [
    "Tattoos benchmark ranges shown here are directional and should be validated against your own pipeline data.",
    "Lead-cost, close-rate, and project-value ranges vary by market, channel mix, and seasonality.",
  ],

  header: {
    badge: "Tattoo Industry",
    headline: "Preview Your Tattoo on Your Skin Before the Needle Touches",
    highlightWord: "Tattoo",
    intro:
      `Tattoos are permanent. That's the entire appeal — and the entire obstacle. Clients hesitate, reschedule, cancel, and no-show because they can't be sure how a design will actually look on their body. Vizzion lets them upload a photo of their arm, back, leg, or anywhere — and see the tattoo design on their actual skin in seconds. They enter their email to save the preview. You get a committed lead who's already past the fear of regret.`,
    introHighlight: `Tattoos are permanent. That's the entire appeal — and the entire obstacle.`,
    cta: { text: "See It in Action", href: "#how-it-works" },
  },

  context: {
    headline: "Fear of Regret Is Costing You Bookings Every Single Day",
    paragraphs: [
      `You know the pattern. A client books a session, loves the design on paper — then cancels two days out. Or just ghosts. The chair sits empty for three hours. It's almost never about the design itself. It's because they couldn't picture what it would actually look like on their body, at that size, in that placement. Stencils and iPad mock-ups narrow the gap, but they don't close it. The space between "I like this design" and "I'm ready to have this on my skin forever" is where cancellations live.`,
      `The math hurts. U.S. tattoo studios deal with 10 to 20% no-show rates on average, and studios without strong deposit systems can see that climb even higher. At $150 to $200 per hour, one no-show on a three-hour session is $450 to $600 gone — with no way to fill that slot. Deposits recoup some of it, but they don't fix the root cause: clients who can't fully visualize the outcome aren't fully committed to the appointment.`,
      `Your website compounds the problem. It shows completed work on other people's bodies. A potential client sees an incredible sleeve and thinks, "Would that look like that on me?" Your portfolio proves talent. It doesn't prove this design works on this person's body — and that's the confidence that actually drives bookings. Vizzion puts the visualization experience on your site, under your brand, so clients can answer that question themselves.`,
    ],
    highlights: [
      "10 to 20% no-show rates on average",
      "can't fully visualize the outcome",
      "visualization experience on your site",
    ],
    callout: {
      stat: "$600+",
      text: "lost per no-show on a typical three-hour tattoo session — and most studios eat 2-4 no-shows per week.",
    },
  },

  solution: {
    headline: "Turn Curious Browsers Into Committed Bookings",
    intro:
      "Vizzion is a lightweight widget on your studio's website. Clients upload a photo of their arm, shoulder, back, or leg — and see your tattoo design on their actual skin in seconds. They enter their email to save the preview. You get a lead who's already past the fear of regret.",
    points: [
      {
        title: "Kill Fear of Regret at the Source",
        description:
          "The biggest barrier to booking isn't price — it's permanence anxiety. Vizzion lets clients see the design on their body at their chosen placement and size, answering every \"what if\" before they ever contact you.",
      },
      {
        title: "Slash No-Shows and Cancellations",
        description:
          "Clients who've already previewed the tattoo on their own skin cancel at dramatically lower rates. The visualization acts as an emotional deposit — they've already made peace with the decision.",
      },
      {
        title: "Showcase Your Portfolio Interactively",
        description:
          "Static galleries show what you've done for other people. Vizzion lets visitors try your flash sheets and custom designs on themselves — turning passive browsing into personal experience.",
      },
      {
        title: "Capture Leads From Social Traffic",
        description:
          "Instagram doesn't give you email addresses. When followers click your bio link and land on your site, Vizzion gives them a reason to engage and hand over their contact info.",
      },
      {
        title: "Works for Every Style and Placement",
        description:
          "Traditional, realism, blackwork, fine-line, Japanese — any style. Clients upload their own body photos, so placement is always accurate to their actual anatomy, not a generic mannequin.",
      },
    ],
  },

  howItWorks: {
    headline: "Three Steps. Five Minutes to Install. Bookings Start Flowing.",
    intro:
      "No app for clients to download, no complex software to learn. You embed a snippet on your site, upload your designs, and Vizzion handles the rest.",
    steps: [
      {
        number: 1,
        title: "Embed the Widget on Your Studio Website",
        description:
          `Copy a single code snippet and paste it on any page — your homepage, a "Try a Design" landing page, or your portfolio gallery. The widget matches your site's look and feel automatically. Total setup: under five minutes, no developer needed.`,
      },
      {
        number: 2,
        title: "Client Uploads a Body Photo and Sees the Tattoo",
        description:
          "A visitor selects a design from your uploaded catalog (flash sheets, custom pieces, or style samples), then uploads a photo of the body area where they want the tattoo. Within seconds, they see a realistic digital preview of the design on their actual skin — contour-matched, correctly scaled, and positioned where they chose.",
      },
      {
        number: 3,
        title: "You Get a Ready-to-Book Lead",
        description:
          `To save their preview or share it with friends, the client enters their email. That lead flows directly into your inbox or booking system — with their contact info, the design they chose, the body photo, and the visualization they generated. When you follow up, you're talking to someone who has already said "yes" to seeing this tattoo on their body.`,
      },
    ],
  },

  benefits: [
    {
      metric: "10–20%",
      label: "Studio No-Show Rate",
      description:
        "The average U.S. tattoo studio loses 10–20% of appointments to no-shows. At $150–$200/hr, that's $450–$600 vanishing per empty three-hour slot — revenue you can recover by giving clients the confidence to commit.",
    },
    {
      metric: "$262",
      label: "Average Session Spend",
      description:
        "North American tattoo clients spend $262 per session on average. Every no-show or cold-feet cancellation isn't just lost time — it's a high-value booking that walked away over preventable uncertainty.",
    },
    {
      metric: "24%",
      label: "Post-Tattoo Regret Rate",
      description:
        "Pew Research found that 24% of tattooed Americans regret at least one tattoo. Clients know this statistic intuitively — it's the fear that stalls bookings. Letting them preview the design on their own skin defuses that anxiety before it becomes a cancellation.",
    },
    {
      metric: "45–65%",
      label: "Consultation-to-Booking Rate",
      description:
        "Top-performing studios convert 45–65% of consultations to booked sessions. Clients who've already visualized the tattoo on their body arrive at the consultation with their biggest question answered, pushing your conversion rate toward the high end.",
    },
    {
      metric: "$1.3B",
      label: "U.S. Industry Revenue",
      description:
        "The U.S. tattoo artist industry generates $1.3 billion annually across nearly 24,000 studios. Competition is fierce — studios that let clients try designs on their own skin stand out in a crowded market.",
    },
    {
      metric: "28%",
      label: "Higher Inking Rate with Preview",
      description:
        "Studios offering design preview tools report a 28% higher consultation-to-inking rate. When clients have already seen the tattoo on their body and chosen their placement, the session is a formality — not a leap of faith.",
    },
  ],

  comparison: {
    headline: "The Old Way vs. The Vizzion Way",
    oldWay: [
      "Client sees designs on other people and hopes it looks good on them too",
      "Paper stencils and iPad mock-ups at the consultation — after you've already booked the slot",
      "15-30% no-show rate burns hundreds per empty chair per week",
      "Static portfolio website with a contact form that converts 2-3% of visitors",
      "No way to capture leads from social media traffic beyond a booking link",
      "Clients cancel because they got cold feet — not because they found a better artist",
    ],
    vizzionWay: [
      "Client sees the actual design on their actual body before they ever contact you",
      "Visualization happens on your website — before they take up any chair time",
      "Dramatically lower no-shows because clients have already committed emotionally",
      "Interactive website experience that converts visitors at 5-10× static portfolios",
      "Instagram followers try designs on themselves and hand you their email",
      "Clients book with confidence because the fear of regret is already resolved",
    ],
  },

  testimonials: [
    {
      quote:
        `No-shows were killing us. We run a five-chair studio and we were losing $2,000 to $3,000 a week in empty slots from cancellations and ghosts. Since adding Vizzion to our booking page, our no-show rate dropped from about 25% to under 8%. Clients come in and literally show me the preview on their phone — "I want exactly this, right here." The consultation takes half the time because the biggest question is already answered.`,
      author: "Marcus Reeves",
      company: "Iron Crow Tattoo, Baltimore MD",
      result: "No-show rate dropped from 25% to under 8%",
    },
    {
      quote:
        `I specialize in fine-line and micro-realism — the kind of work where placement and scale matter enormously. Clients used to agonize for weeks about size and positioning. Now they upload a photo, try the design at different scales and placements, and come to the consultation with a clear vision. My booking-to-session conversion rate went from about 60% to over 90%. And I'm spending way less time on back-and-forth DMs.`,
      author: "Sofia Delgado",
      company: "Studio Delgado, Portland OR",
      result: "Booking-to-session conversion rate increased from 60% to 90%+",
    },
    {
      quote:
        `We put the widget on our flash page and it changed everything. People used to just scroll through the flash and maybe DM us on Instagram. Now they try the designs on their arm or leg, get excited, and drop their email right there. We went from maybe 10 website leads a month to over 80. And these aren't tire-kickers — they've already seen the tattoo on their body and they're ready to go.`,
      author: "Jake Thornton",
      company: "Black Anvil Tattoo, Nashville TN",
      result: "Website leads increased from 10/month to 80+/month",
    },
  ],

  faq: [
    {
      question: "How long does it take to set up Vizzion on my studio website?",
      answer:
        `Under five minutes. Copy one embed snippet and paste it on your flash page, portfolio gallery, or booking page — it works with WordPress, Squarespace, Wix, and custom-built studio sites. No developer needed. The widget matches your site's look automatically and starts capturing leads from your existing traffic right away.`,
    },
    {
      question: "Can I upload my own tattoo designs and flash sheets?",
      answer:
        "Absolutely. You upload your own designs — flash sheets, custom pieces, signature styles, or style category samples. Clients only see your work, and the widget acts as an interactive extension of your portfolio. You control exactly what designs are available for preview.",
    },
    {
      question: "How realistic are the tattoo previews?",
      answer:
        "The previews are photo-realistic digital renderings that account for skin contours, body curvature, and natural shading. They give clients a strong, accurate sense of how the design will look at their chosen size and placement. While no digital preview can perfectly replicate ink on skin, the visualization is accurate enough to resolve placement, scale, and style questions — the exact concerns that cause cancellations.",
    },
    {
      question: "Does the client need to download an app?",
      answer:
        "No. Vizzion runs entirely in the browser — clients just visit your site, try designs on their skin, and book. No app download, no account creation, no signup friction that kills the impulse to engage. It works on any smartphone or computer, which matters when someone's browsing your portfolio at 1 AM.",
    },
    {
      question: "How is this different from InkHunter or other tattoo preview apps?",
      answer:
        `InkHunter and similar apps are consumer-facing tools — they let users try generic designs from a public library. Vizzion is a business tool built for your studio. It lives on your website, showcases your designs, captures leads with email addresses, and feeds them into your booking system. The client interacts with your brand, not a third-party app. And you own the lead.`,
    },
    {
      question: "Does Vizzion work with my booking software?",
      answer:
        "Yes. Most tattoo studios run Square Appointments, Vagaro, Acuity, or Tattoodo Pro — Vizzion integrates with all of them, plus anything that supports Zapier or webhooks. Leads land in your booking system with the client's contact info, chosen design, body photo, and preview attached, so you can follow up and confirm the session without any back-and-forth.",
    },
    {
      question: "How much does Vizzion cost?",
      answer:
        `There's a free tier to test it out, with scaled plans for busier shops. At $262 average session spend, even one additional booking per month more than covers the cost — and when you consider that a single no-show on a three-hour session burns $450 to $600 in lost chair time, the math is hard to argue with. Most studios hit positive ROI within the first week.`,
    },
    {
      question: "Can clients try different placements and sizes?",
      answer:
        "Yes. Clients can adjust the position and scale of the design on their body photo, trying different placements before settling on the one they love. This is one of the most powerful features for reducing post-booking anxiety — clients arrive at their session confident about exactly where and how big the tattoo will be.",
    },
  ],

  cta: {
    headline: "Fill Every Chair. Eliminate the Fear.",
    subtext:
      "Five-minute setup. No credit card required. Let clients see your designs on their own skin — and watch your no-show rate disappear.",
    buttonText: "Get Started Free",
    href: "#signup",
  },

  seo: {
    keywords: [
      "tattoo visualization tool",
      "tattoo preview widget",
      "tattoo studio lead generation",
      "tattoo try-on tool",
      "tattoo placement preview",
      "tattoo website widget",
      "tattoo studio marketing",
      "tattoo booking tool",
      "tattoo design preview",
      "tattoo studio leads",
      "reduce tattoo no-shows",
      "tattoo client visualization",
      "tattoo studio website tool",
      "tattoo virtual try-on",
      "tattoo flash preview tool",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Vizzion Tattoo Visualization Widget",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Embeddable tattoo visualization tool that helps studios generate committed leads and reduce no-shows. Clients see realistic previews of tattoo designs on their actual skin — then submit their email to save the result.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier available. Premium plans based on visualization volume.",
      },
      featureList: [
        "Realistic tattoo-on-skin visualization",
        "Embeddable website widget",
        "White-label branding",
        "Booking system integration",
        "Lead capture and routing",
        "5-minute setup",
        "Custom design and flash sheet uploads",
        "Adjustable placement and sizing",
      ],
      screenshot: "https://vizzion.io/images/industries/tattoos.png",
      url: "https://vizzion.io/industries/tattoos",
    },
  },
};
