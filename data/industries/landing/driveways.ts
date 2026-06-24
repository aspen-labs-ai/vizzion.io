import type { IndustryLandingData } from './types';

export const drivewaysLanding: IndustryLandingData = {
  slug: 'driveways',
  name: 'Driveways & Hardscaping',
  shortName: 'Driveways',

  hero: {
    eyebrow: 'Driveways visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked driveways.',
    sub: 'Vizzion lets homeowners see real pavers, stamped concrete, and natural stone on their actual driveway, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourpavingco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 3-inch chip can't show a",
    headlineAccent: 'whole-driveway pattern.',
    body: "A driveway is the largest visible surface on a property, and color and pattern rarely read the same at full scale: a chip that looks warm grey in a sample binder can read almost beige across 1,000 square feet of driveway. A palm-sized sample or a stock photo of someone else's driveway never answers the only question that matters — what will it look like on mine? So homeowners stall, delay, and keep shopping. Vizzion erases that doubt by rendering the real material on their real driveway.",
    bodyHighlights: ['almost beige across 1,000 square feet of driveway', 'stall, delay, and keep shopping'],
    video: { src: '/videos/driveways.mp4', poster: '/images/industries/driveways.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual driveway, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their driveway',
      body: 'Vizzion renders real materials onto their real driveway in seconds. They preview pavers, stamped concrete, and natural stone, each shown at full scale on their property.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the driveway photo, and the exact material they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead resold to four other paving crews',
      'A race to the bottom on price before you even call',
      'A 3-inch chip and "just imagine it on the whole driveway"',
      'Paying $25–$75 per shared lead, win or lose',
      'Starting at "can I come measure your driveway?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'They see their chosen paver or stone on their real driveway',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which pattern did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 41, suffix: '%', label: 'of paving site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the paving company down the street. Each one arrives with the homeowner's driveway photo and the exact material they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real materials are rendered onto their actual driveway in true color and pattern, at full scale. It is what their property would look like, not a guess from a 3-inch chip or a stock photo of someone else's driveway.",
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
    name: 'Vizzion Driveways Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable driveway visualization tool that helps paving contractors generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of pavers, stamped concrete, and natural stone on their actual driveway.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic driveway material visualization on homeowner photos',
      'Configurable paving products and custom uploaded materials',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with driveway photo and material preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/driveways.png',
    url: 'https://vizzion.io/industries/driveways',
  },
};
