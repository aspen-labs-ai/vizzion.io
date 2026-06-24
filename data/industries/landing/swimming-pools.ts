import type { IndustryLandingData } from './types';

export const swimmingPoolsLanding: IndustryLandingData = {
  slug: 'swimming-pools',
  name: 'Swimming Pools',
  shortName: 'Swimming Pools',

  hero: {
    eyebrow: 'Swimming Pools visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked pool builds.',
    sub: 'Vizzion lets homeowners see pool shapes, finishes, decking, and water in their actual backyard, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourpoolco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "There's no showroom for a",
    headlineAccent: '$50,000 pool.',
    body: "A pool is the biggest project most backyards will ever see, and the single hardest thing to picture before it is poured. A flat 2D drawing or a gallery of someone else's pools never answers the only question that matters: what will it look like in my yard? So homeowners stall, keep researching, and put off the deposit. Vizzion erases that doubt by rendering a real pool design in their actual backyard.",
    bodyHighlights: ["someone else's pools", 'put off the deposit'],
    video: { src: '/videos/swimming-pools.mp4', poster: '/images/industries/swimming-pools.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual backyard, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it in their backyard',
      body: 'Vizzion renders a real pool design into their real backyard in seconds. They preview shapes, finishes, decking, and water, each shown at full scale in their yard.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the backyard photo, and the exact design they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to four other builders',
      'A race to the bottom on price before you even call',
      'Cold names that ghost half the time',
      'Paying per shared lead, win or lose, forever',
      'Starting at "can I come measure your yard?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm homeowners who already picked a design',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which design did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of pool site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the builder down the street. Each one arrives with the homeowner's backyard photo and the exact design they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "A real pool design is rendered into their actual backyard at full scale, in true shape and finish. It is what their yard would look like, not a guess pulled from a flat 2D drawing or a stock photo of someone else's pool.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra build typically covers it many times over. Get started to find the fit for your business.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Swimming Pools Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable swimming pool visualization tool that helps pool builders generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of pool designs, finishes, and decking in their actual backyard.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic pool visualization on homeowner backyard photos',
      'Configurable pool designs and custom uploaded options',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with backyard photo and design preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/swimming-pools.png',
    url: 'https://vizzion.io/industries/swimming-pools',
  },
};
