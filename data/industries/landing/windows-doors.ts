import type { IndustryLandingData } from './types';

export const windowsDoorsLanding: IndustryLandingData = {
  slug: 'windows-doors',
  name: 'Windows & Doors',
  shortName: 'Windows & Doors',

  hero: {
    eyebrow: 'Windows & Doors visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked installs.',
    sub: 'Vizzion lets homeowners see your window and door styles and colors on their actual home, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourwindowco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A corner sample can't sell a",
    headlineAccent: 'whole new facade.',
    body: "Windows and doors reshape the most visible part of a home, and style and color shift completely at scale. Black frames that look sharp on a corner sample can completely change the character of an entire facade, and a door that pops in the showroom can disappear against their brick. So homeowners stall, delay, and keep shopping. Vizzion erases that doubt by rendering your real styles and colors on their actual home.",
    bodyHighlights: ['completely change the character of an entire facade', 'stall, delay, and keep shopping'],
    video: { src: '/videos/windows-doors.mp4', poster: '/images/industries/windows-doors.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual home, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They preview it on their home',
      body: 'Vizzion renders your real window and door styles onto their real home in seconds. They preview frame styles, colors, and grid patterns, each shown to scale on their facade.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the home photo, and the exact styles they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same shared lead, sold to three other window companies',
      'Handing over a 12-inch sample and hoping they picture it',
      "Driving out to measure before they've committed to anything",
      'Losing weeks to "we need to think about the color"',
      "A static gallery of other people's homes, like every competitor",
    ],
    new: [
      'Exclusive leads from your own site, yours alone and never resold',
      'They see your real styles and colors on their actual home',
      'Prospects who already picked a style before you pick up the phone',
      'Color decided before the first call, not after the third',
      'An interactive preview that makes your site the one they remember',
    ],
  },

  proof: {
    stats: [
      { target: 95, suffix: '%', label: 'of window & door site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the window company down the street. Each one arrives with the homeowner's home photo and the exact window and door styles they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real window and door styles are rendered onto their actual home in true color and detail, to scale. It is what their facade would look like, not a guess pulled from a 12-inch sample or a stock photo of someone else's house.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra install typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Windows & Doors Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable window and door visualization tool that helps window and door companies generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of window and door styles, frame colors, and grid patterns on their actual home.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic window and door visualization on homeowner photos',
      'Configurable window and door styles and custom uploaded options',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with home photo and style preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/windows-doors.png',
    url: 'https://vizzion.io/industries/windows-doors',
  },
};
