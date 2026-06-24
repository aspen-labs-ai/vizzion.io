import type { IndustryLandingData } from './types';

export const artificialTurfLanding: IndustryLandingData = {
  slug: 'artificial-turf',
  name: 'Artificial Turf',
  shortName: 'Artificial Turf',

  hero: {
    eyebrow: 'Artificial Turf visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked lawns.',
    sub: 'Vizzion lets homeowners see real turf blade styles, colors, and pile heights on their actual yard, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yourturfco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 4-inch swatch can't sell a",
    headlineAccent: '2,000-square-foot lawn.',
    body: "A lawn is one of the biggest things anyone sees on a property, and turf is one of the hardest things to picture changing. A 4-inch swatch that looks lush in the hand, or a gallery photo of someone else's yard, never answers the only question that matters: will it look natural on my yard? So homeowners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering real turf on their real yard.",
    bodyHighlights: ["someone else's yard", 'will it look natural on my yard?'],
    video: { src: '/videos/artificial-turf.mp4', poster: '/images/industries/artificial-turf.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual yard, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their yard',
      body: 'Vizzion renders real turf onto their real yard in seconds. They preview blade styles, colors, and pile heights, each shown at full scale on their lawn.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the yard photo, and the exact turf they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to four other installers',
      'A race to the bottom on price before you even call',
      'Cold names that ghost half the time',
      'Paying per shared lead, win or lose, forever',
      'Starting at "can I come measure your yard?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm homeowners who already picked their turf',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which one did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 96, suffix: '%', label: 'of turf site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the installer down the street. Each one arrives with the homeowner's yard photo and the exact turf they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real turf is rendered onto their actual yard in true color and style, at full scale. It is what their lawn would look like, not a guess pulled from a 4-inch swatch or a gallery photo of someone else's yard.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One extra install typically covers it many times over. Get started to find the fit for your business.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Artificial Turf Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable artificial turf visualization tool that helps turf installers generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of turf blade styles, colors, and pile heights on their actual yard.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic turf visualization on homeowner photos',
      'Configurable turf products and custom uploaded options',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with yard photo and product preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/artificial-turf.png',
    url: 'https://vizzion.io/industries/artificial-turf',
  },
};
