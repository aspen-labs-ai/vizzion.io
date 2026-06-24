import type { IndustryLandingData } from './types';

export const deckingLanding: IndustryLandingData = {
  slug: 'decking',
  name: 'Decking',
  shortName: 'Decking',

  hero: {
    eyebrow: 'Decking visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked decks.',
    sub: 'Vizzion lets homeowners see your composite and wood decking on their actual backyard, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourdeckco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 3-inch sample board can't sell a",
    headlineAccent: 'whole backyard deck.',
    body: "A deck is the biggest outdoor project most homeowners ever take on, and one of the hardest finishes to picture before it exists. A 3-inch sample board, or a stock photo of someone else's yard, never answers the only question that matters: what will it look like on mine? Color reads differently at scale, and a board that looks warm brown in the hand can wash out across an entire deck surface next to their siding. So homeowners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering the real material on their real backyard.",
    bodyHighlights: ["someone else's yard", 'wash out across an entire deck surface'],
    video: { src: '/videos/decking.mp4', poster: '/images/industries/decking.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual backyard, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their backyard',
      body: 'Vizzion renders real materials onto their real backyard in seconds. They preview composite and wood decking in the colors you offer, each shown at full scale in their yard.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the backyard photo, and the exact material they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to three other deck builders',
      'A race to the bottom on price before you even call',
      'Cold names that ghost half the time',
      'Paying $15–$75 per shared lead, win or lose',
      'Starting at "can I come measure your yard?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm homeowners who already picked a material',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which one did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of decking site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the deck builder across town. Each one arrives with the homeowner's backyard photo and the exact material they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real decking materials and colors are rendered onto their actual backyard in true color, at full scale. It is what their yard would look like, not a guess pulled from a 3-inch sample board or a stock photo of someone else's deck.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra job typically covers it many times over. Get started to find the fit for your business.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Decking Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable decking visualization tool that helps deck builders generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of composite and wood decking materials and colors on their actual backyard.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic deck material visualization on homeowner photos',
      'Configurable decking products and custom uploaded materials',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with backyard photo and material preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/decking.png',
    url: 'https://vizzion.io/industries/decking',
  },
};
