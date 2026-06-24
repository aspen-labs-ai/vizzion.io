import type { IndustryLandingData } from './types';

export const countertopsLanding: IndustryLandingData = {
  slug: 'countertops',
  name: 'Countertops & Stone',
  shortName: 'Countertops',

  hero: {
    eyebrow: 'Countertops visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked countertop jobs.',
    sub: 'Vizzion lets homeowners see real quartz, granite, and marble in their actual kitchen, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourcountertopco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 4-inch chip can't show a",
    headlineAccent: 'full slab in their kitchen.',
    body: "Stone reads completely differently at scale: a busy granite that looks rich on a chip the size of a credit card can overwhelm an entire island, and veining that's subtle up close can flow in unexpected ways across a full run. A 4-inch sample held to the cabinets under showroom lights never answers the only question that matters — what will it look like in my kitchen? So homeowners stall, delay, and keep shopping. Vizzion erases that doubt by rendering the real material in their actual kitchen.",
    bodyHighlights: ['overwhelm an entire island', 'stall, delay, and keep shopping'],
    video: { src: '/videos/countertops.mp4', poster: '/images/industries/countertops.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual kitchen, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They preview it in their kitchen',
      body: 'Vizzion renders real countertop materials into their actual kitchen in seconds. They preview quartz, granite, marble, and the slabs you offer, each shown at full scale on their own counters.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the kitchen photo, and the exact material they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same shared lead, sold to three other fabricators',
      'Handing over a 4-inch chip and hoping they picture a whole kitchen',
      "Sending them to the slab yard before they've committed to anything",
      'Losing deals to "we want to think about the material" for weeks',
      "A static gallery of other people's kitchens, like every competitor",
    ],
    new: [
      'Exclusive leads from your own site, yours alone and never resold',
      'They see their chosen material in their real kitchen',
      'Prospects who already picked a material and color before you call',
      'Material decided before the first call, not after the third',
      'An interactive preview that makes your site the one they remember',
    ],
  },

  proof: {
    stats: [
      { target: 67, suffix: '%', label: 'of countertop site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the fabricator down the street. Each one arrives with the homeowner's kitchen photo and the exact material they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real materials are rendered into their actual kitchen in true color and veining, at full scale. It is what their counters would look like, not a guess pulled from a 4-inch chip or a stock photo of someone else's kitchen.",
    },
    {
      q: 'Will it work on my website?',
      a: 'Yes. WordPress, Wix, Squarespace, or a fully custom build. It is one line of code, live in about five minutes, with no developer required.',
    },
    {
      q: 'Does it slow my site down?',
      a: 'No. It is a lightweight embed that loads on its own and matches your branding and colors, so it looks native to your site without dragging down your page speed.',
    },
    {
      q: 'What does it cost?',
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra countertop job typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Countertops Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable countertop visualization tool that helps countertop shops and stone fabricators generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of quartz, granite, and marble in their actual kitchen.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic countertop material visualization on homeowner photos',
      'Configurable countertop materials and custom uploaded slabs',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with kitchen photo and material preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/countertops.png',
    url: 'https://vizzion.io/industries/countertops',
  },
};
