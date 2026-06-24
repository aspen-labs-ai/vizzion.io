import type { IndustryLandingData } from './types';

export const boatDeckingLanding: IndustryLandingData = {
  slug: 'boat-decking',
  name: 'Boat Decking',
  shortName: 'Boat Decking',

  hero: {
    eyebrow: 'Boat Decking visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked decks.',
    sub: 'Boat owners upload a photo of their boat and preview your decking colors and patterns on it. They enter their email to save the result — you get an exclusive lead from your own site traffic.',
    demo: 'photo',
    demoAddress: 'yourmarineco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 4-inch foam chip can't sell a",
    headlineAccent: "40-foot boat's deck.",
    body: "The deck is the surface a boat owner stands on every trip, and the hardest thing to picture changing. A 4-inch foam chip or a stock photo of someone else's boat never answers the only question that matters: what will it look like on mine? A color that looks crisp on the helm pad can wash out across an entire cockpit sole, so owners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering the real decking on their real boat.",
    bodyHighlights: ["someone else's boat", 'wash out across an entire cockpit sole'],
    video: { src: '/videos/boat-decking.mp4', poster: '/images/industries/boat-decking.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A boat owner drops in a photo of their actual boat, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their boat',
      body: 'Vizzion renders real decking colors and patterns onto their real deck in seconds. They preview the foam colors and patterns you offer, each shown at full scale on their own boat.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the boat photo, and the exact color and pattern they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to three other shops',
      'A race to the bottom on price before you even call',
      'Cold names that ghost half the time',
      'Paying per lead, win or lose, forever',
      'Starting at "what kind of boat do you have?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm boat owners who already picked a color and pattern',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which look did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 97, suffix: '%', label: 'of marine decking site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the shop down the dock. Each one arrives with the boat owner's photo and the exact color and pattern they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real decking colors and patterns are rendered onto their actual boat in true color and scale. It is what their deck would look like, not a guess pulled from a 4-inch foam chip or a stock photo of someone else's boat.",
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
    name: 'Vizzion Boat Decking Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable boat decking visualization tool that helps marine decking shops generate exclusive, pre-qualified leads from their own website traffic. Boat owners see realistic previews of foam decking colors and patterns on their actual boat.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic decking visualization on boat owner photos',
      'Configurable decking colors and patterns plus custom uploads',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with boat photo and decking preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/boat-decking.png',
    url: 'https://vizzion.io/industries/boat-decking',
  },
};
