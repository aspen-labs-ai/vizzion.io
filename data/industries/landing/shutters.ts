import type { IndustryLandingData } from './types';

export const shuttersLanding: IndustryLandingData = {
  slug: 'shutters',
  name: 'Exterior Shutters',
  shortName: 'Shutters',

  hero: {
    eyebrow: 'Shutters visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked shutter jobs.',
    sub: 'Vizzion lets homeowners see your shutter styles and colors on their actual home, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourshuttersco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 4-inch swatch can't sell a",
    headlineAccent: 'whole front elevation.',
    body: "Shutters frame every window on the front of a home, and color and style read completely different across a full facade than they do on a four-inch swatch. A sample chip or a portfolio of houses that look nothing like theirs never answers the only question that matters: what will it look like on mine? So homeowners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering your real shutters on their real home.",
    bodyHighlights: ['completely different across a full facade', 'what will it look like on mine?'],
    video: { src: '/videos/shutters.mp4', poster: '/images/industries/shutters.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual home, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their home',
      body: 'Vizzion renders your real shutters onto their real home in seconds. They preview the styles and colors you offer, from louvered to raised panel to board-and-batten, each shown at full scale on their facade.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the home photo, and the exact shutter style and color they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to four other shutter companies',
      'A four-inch swatch and "just picture it on your house"',
      'Cold names that ghost before the measure',
      'Paying per shared lead, win or lose, forever',
      'Starting at "can I come measure your windows?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Their chosen style and color on their real home',
      'Warm homeowners who already picked a look',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which style did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 95, suffix: '%', label: 'of shutter site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the shutter company down the street. Each one arrives with the homeowner's home photo and the exact shutter style and color they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Your real shutter styles and colors are rendered onto their actual home in true color, at full scale on the facade. It is what their house would look like, not a guess pulled from a four-inch swatch or a stock photo of someone else's home.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra shutter job typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Shutters Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable shutter visualization tool that helps shutter companies generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of shutter styles and colors on their actual home.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic shutter visualization on homeowner photos',
      'Configurable shutter products and custom uploaded materials',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with home photo and shutter preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/shutters.png',
    url: 'https://vizzion.io/industries/shutters',
  },
};
