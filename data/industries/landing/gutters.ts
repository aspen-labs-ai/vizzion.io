import type { IndustryLandingData } from './types';

export const guttersLanding: IndustryLandingData = {
  slug: 'gutters',
  name: 'Gutters',
  shortName: 'Gutters',

  hero: {
    eyebrow: 'Gutters visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked gutter jobs.',
    sub: 'Vizzion lets homeowners see your gutter profiles and colors — seamless aluminum to copper — on their actual home, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourguttersco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A two-inch color chip can't show gutters on",
    headlineAccent: 'their actual home.',
    body: "Gutters wrap the entire edge of a home, yet homeowners are asked to choose a color from a ring of two-inch chips fanned out in the driveway. Color shifts at scale: a chip that looks warm bronze in direct sunlight can read flat brown along an entire fascia. So they can't picture musket brown versus dark bronze on their own home, default to white, and the upgrade never happens. Vizzion erases that doubt by rendering the real profile and color on their actual home.",
    bodyHighlights: ['read flat brown along an entire fascia', 'the upgrade never happens'],
    video: { src: '/videos/gutters.mp4', poster: '/images/industries/gutters.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual home, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They preview it on their home',
      body: 'Vizzion renders your real gutter profiles and colors onto their actual home in seconds. They preview seamless aluminum and copper, each shown at full scale on their roofline.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the home photo, and the exact profile and color they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead resold to three other contractors',
      'A ring of two-inch chips and "just picture it"',
      'Driving out to measure before they commit to anything',
      'Deals lost to "just match the trim" and the lowest bid',
      "A static gallery of other people's homes, like every competitor",
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Your real profiles and colors on their actual home',
      'Homeowners who already picked a profile and color',
      'Color settled before the first call, not in the driveway',
      'An interactive preview that makes your site the one they remember',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of gutter site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the contractor down the street. Each one arrives with the homeowner's home photo and the exact profile and color they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Your real profiles and colors are rendered onto their actual home in true color and at full scale. It is what their home would look like, not a guess pulled from a two-inch chip or a stock photo of someone else's house.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra gutter job typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Gutters Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable gutter visualization tool that helps gutter contractors generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of gutter profiles and colors on their actual home.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic gutter visualization on homeowner photos',
      'Configurable gutter profiles, colors, and custom uploaded options',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with home photo and gutter preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/gutters.png',
    url: 'https://vizzion.io/industries/gutters',
  },
};
