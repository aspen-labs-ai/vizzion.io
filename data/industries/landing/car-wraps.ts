import type { IndustryLandingData } from './types';

export const carWrapsLanding: IndustryLandingData = {
  slug: 'car-wraps',
  name: 'Car & Vehicle Wraps',
  shortName: 'Car Wraps',

  hero: {
    eyebrow: 'Car Wraps visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked wraps.',
    sub: 'Vizzion lets customers see real gloss, matte, satin, and color-shift films on their actual vehicle, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourwrapshop.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 3-inch film chip can't sell a",
    headlineAccent: 'whole vehicle.',
    body: "A wrap is the most visible thing your customer owns, and the single hardest thing to picture changing. A tiny film swatch or a spec sheet of brand names never answers the only question that matters: what will it look like on my car? A chip that looks deep blue in the hand can wash out across a whole hood and roofline, so they ask for yet another free mockup, or they stall and keep shopping. Vizzion erases that doubt by rendering the real finish on their real vehicle.",
    bodyHighlights: ['ask for yet another free mockup', 'stall and keep shopping'],
    video: { src: '/videos/car-wraps.mp4', poster: '/images/industries/car-wraps.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A customer drops in a photo of their actual vehicle, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their vehicle',
      body: 'Vizzion renders real films onto their real vehicle in seconds. They preview gloss, matte, satin, and color-shift finishes, each shown at full scale on their car.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the vehicle photo, and the exact finish they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'Hours of designer time on free mockups for tire-kickers',
      'Handing over a film swatch, hoping they picture a whole car',
      'Revision after revision before anyone commits',
      'Deals stalling on "let me think about the color"',
      "A static gallery of other people's cars, like everyone else",
    ],
    new: [
      'Exclusive leads from your own site at near-zero cost',
      'They see your finish on their real vehicle',
      'Prospects who already picked a color and finish',
      'Color settled before the first quote, not the third mockup',
      'An interactive preview that makes your site the one they remember',
    ],
  },

  proof: {
    stats: [
      { target: 60, suffix: '%+', label: 'of car wrap site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the shop down the street. Each one arrives with the customer's vehicle photo and the exact finish they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real films are rendered onto their actual vehicle in true color and finish, at full scale. It is what their car would look like, not a guess pulled from a 3-inch chip or a photo of someone else's car.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra wrap typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Car Wraps Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable car wrap visualization tool that helps wrap shops generate exclusive, pre-qualified leads from their own website traffic. Customers see realistic previews of gloss, matte, satin, and color-shift films on their actual vehicle.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic wrap film visualization on customer vehicle photos',
      'Configurable wrap films and custom uploaded films',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with vehicle photo and finish preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/car-wraps.png',
    url: 'https://vizzion.io/industries/car-wraps',
  },
};
