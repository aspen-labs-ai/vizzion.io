import type { IndustryLandingData } from './types';

export const garageDoorsLanding: IndustryLandingData = {
  slug: 'garage-doors',
  name: 'Garage Doors',
  shortName: 'Garage Doors',

  hero: {
    eyebrow: 'Garage Doors visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked doors.',
    sub: 'Vizzion lets homeowners see your garage door styles, colors, and window options on their actual home, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourgaragedoorco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A brochure thumbnail can't sell",
    headlineAccent: '40% of the front of the house.',
    body: "The garage door fills up to 40 percent of the front of the house, and it's the single hardest feature to picture changing. A thumbnail in a brochure or a photo of someone else's home never answers the only question that matters: what will it look like on mine? A carriage-house door that looks perfect in the catalog can read completely different against their brick, their roofline, and their driveway, so homeowners stall, delay, and keep shopping. Vizzion erases that doubt by rendering the real door on their real home.",
    bodyHighlights: ["someone else's home", 'stall, delay, and keep shopping'],
    video: { src: '/videos/garage-doors.mp4', poster: '/images/industries/garage-doors.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual home, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their home',
      body: 'Vizzion renders your garage doors onto their real home in seconds. They preview the styles, colors, and window options you offer, each shown at full scale on their house.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the home photo, and the exact door they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to three other dealers',
      'A race to the bottom on price before you even call',
      'Cold names that ghost while they keep shopping',
      'Paying per lead, win or lose, forever',
      'Starting at "can I come measure the door?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm homeowners who already picked a door style',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which style did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of garage door site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the dealer down the street. Each one arrives with the homeowner's home photo and the exact garage door they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real garage door styles are rendered onto their actual home in true color and style, at full scale. It is what their house would look like, not a guess pulled from a brochure thumbnail or a stock photo of someone else's home.",
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
    name: 'Vizzion Garage Doors Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable garage door visualization tool that helps garage door dealers generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of garage door styles, colors, and window options on their actual home.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic garage door visualization on homeowner photos',
      'Configurable door styles, colors, and window options plus custom uploads',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with home photo and door style preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/garage-doors.png',
    url: 'https://vizzion.io/industries/garage-doors',
  },
};
