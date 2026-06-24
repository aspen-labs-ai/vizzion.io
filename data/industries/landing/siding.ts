import type { IndustryLandingData } from './types';

export const sidingLanding: IndustryLandingData = {
  slug: 'siding',
  name: 'Siding & Exterior Cladding',
  shortName: 'Siding',

  hero: {
    eyebrow: 'Siding visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked siding jobs.',
    sub: 'Vizzion lets homeowners see real vinyl and fiber cement siding on their actual home, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yoursidingco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 3-inch swatch can't show a",
    headlineAccent: 'whole-house color.',
    body: "Siding covers the most visible part of a home, and color almost never reads the same at full scale: a swatch that looks like a soft gray in the showroom can turn cold and stark across an entire facade. A palm-sized sample or a stock photo of someone else's house never answers the only question that matters — what will it look like on mine? So homeowners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering the real siding on their real home.",
    bodyHighlights: ['cold and stark across an entire facade', "someone else's house"],
    video: { src: '/videos/siding.mp4', poster: '/images/industries/siding.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual home, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their home',
      body: 'Vizzion renders real siding onto their real home in seconds. They preview vinyl, fiber cement, and the colors you offer, each shown at full scale across their facade.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the home photo, and the exact siding they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead resold to four other siding crews',
      'A race to the bottom on price before you even call',
      'A 3-inch swatch and "just imagine it on the whole house"',
      'Paying $60–$120 per shared lead, win or lose',
      'Starting at "can I come measure your house?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'They see their chosen siding on their real home',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which color did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of siding site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the siding company down the street. Each one arrives with the homeowner's home photo and the exact siding they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real siding is rendered onto their actual home in true color and texture, at full scale across the facade. It is what their house would look like, not a guess from a 3-inch swatch or a stock photo of someone else's home.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra job typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Siding Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable siding visualization tool that helps siding contractors generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of vinyl, fiber cement, and other siding on their actual home.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic siding visualization on homeowner photos',
      'Configurable siding products and custom uploaded materials',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with home photo and material preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/siding.png',
    url: 'https://vizzion.io/industries/siding',
  },
};
