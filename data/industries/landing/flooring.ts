import type { IndustryLandingData } from './types';

export const flooringLanding: IndustryLandingData = {
  slug: 'flooring',
  name: 'Flooring',
  shortName: 'Flooring',

  hero: {
    eyebrow: 'Flooring visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked floors.',
    sub: 'Vizzion lets shoppers see real hardwood, luxury vinyl plank, and tile in their actual room, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourflooringco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 3-inch chip can't sell a",
    headlineAccent: 'wall-to-wall floor.',
    body: "A floor covers the whole room, and color and grain shift at scale: a plank that looks like warm honey oak on a sample chip can read orange across a north-facing room. A chip held against the old floor never answers the only question that matters: what will it look like in mine? So shoppers stall, delay, and keep shopping. Vizzion erases that doubt by rendering the real floor in their real room.",
    bodyHighlights: ['orange across a north-facing room', 'stall, delay, and keep shopping'],
    video: { src: '/videos/flooring.mp4', poster: '/images/industries/flooring.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A shopper drops in a photo of their actual room, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it in their room',
      body: 'Vizzion renders real flooring onto their real room in seconds. They preview hardwood, luxury vinyl plank, and tile, each shown at full scale on their floor.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the room photo, and the exact floor they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to four other stores',
      'A 3-inch chip and "just imagine the whole room"',
      'Three to five showroom visits before they commit',
      'Deals that stall on "let us think about the color"',
      "A static gallery of other people's rooms",
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Their chosen floor on their real room photo',
      'Shoppers who arrive having already picked a floor',
      'Color settled on screen before the first visit',
      'An interactive preview they actually remember',
    ],
  },

  proof: {
    stats: [
      { target: 95, suffix: '%', label: 'of flooring site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the store down the street. Each one arrives with the shopper's room photo and the exact floor they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: 'Real flooring is rendered into their actual room in true color and grain, at full scale. It is what their room would look like, not a guess pulled from a 3-inch chip held against the old floor.',
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra job typically covers it many times over. Get started to find the fit for your store.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Flooring Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable flooring visualization tool that helps flooring retailers generate exclusive, pre-qualified leads from their own website traffic. Customers see realistic previews of hardwood, luxury vinyl plank, tile, and other flooring in their actual room.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic flooring visualization on customer room photos',
      'Configurable flooring products and custom uploaded options',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with room photo and flooring preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/flooring.png',
    url: 'https://vizzion.io/industries/flooring',
  },
};
