import type { IndustryLandingData } from './types';

export const fencingLanding: IndustryLandingData = {
  slug: 'fencing',
  name: 'Fencing',
  shortName: 'Fencing',

  hero: {
    eyebrow: 'Fencing visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked fences.',
    sub: 'Vizzion lets homeowners see real wood, vinyl, aluminum, and composite fences on their actual yard, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourfenceco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 6-inch sample can't show a",
    headlineAccent: 'fence around their yard.',
    body: "A fence wraps the whole yard and gets seen every day, yet it's the hardest thing to picture before it's built. A 6-inch sample panel or a stock photo of someone else's yard never answers the only question that matters: what will it look like on mine? A cedar picket that looks warm on a display rack reads completely different stretched 150 feet along their property line, so homeowners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering the real fence on their real yard.",
    bodyHighlights: ["someone else's yard", 'stretched 150 feet along their property line'],
    video: { src: '/videos/fencing.mp4', poster: '/images/industries/fencing.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual yard, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their yard',
      body: 'Vizzion renders real fence styles onto their real yard in seconds. They preview wood, vinyl, aluminum, and composite, each shown at full scale along their property line.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the yard photo, and the exact fence style they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'Shared leads sold to three or four contractors at once',
      'A 6-inch sample panel doing all the selling',
      "Driving out to measure before they've committed to anything",
      'Losing deals to "we want to think about the style"',
      "A static gallery of other people's yards",
    ],
    new: [
      'Exclusive leads from your own site, never resold',
      'They see their chosen fence on their real yard',
      'Prospects who already picked a style, material, and height',
      'Style settled before the first call, not after the third',
      'An interactive preview your visitors actually remember',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of fencing site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the contractor down the street. Each one arrives with the homeowner's yard photo and the exact fence style they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real fence styles are rendered onto their actual yard in true color and material, at full scale along their property line. It is what their yard would look like, not a guess pulled from a 6-inch sample panel or a stock photo of someone else's yard.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra fence job typically covers it many times over. Get started to find the fit for your shop.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Fencing Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable fence visualization tool that helps fence contractors generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of wood, vinyl, aluminum, and composite fence styles on their actual yard.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic fence style visualization on homeowner photos',
      'Configurable fence styles and custom uploaded materials',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with yard photo and fence preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/fencing.png',
    url: 'https://vizzion.io/industries/fencing',
  },
};
