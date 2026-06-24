import type { IndustryLandingData } from './types';

export const solarLanding: IndustryLandingData = {
  slug: 'solar',
  name: 'Solar Energy',
  shortName: 'Solar',

  hero: {
    eyebrow: 'Solar visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked installs.',
    sub: 'Vizzion lets homeowners see your solar panels on their actual roof, right on your site. Every saved preview lands in your inbox as an exclusive lead.',
    demo: 'photo',
    demoAddress: 'yoursolarco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "Homeowners won't buy panels they",
    headlineAccent: "can't picture on their roof.",
    body: "Your visitor is about to spend $20,000 to $30,000 on a system that will sit on their roof for the next 25 years, then tries to picture it from a stock photo of someone else's house that looks nothing like their own. They can't tell how the panels will lay out on their roof, or whether it will look bulky from the street, so they stall, keep shopping, and quietly disappear. Vizzion erases that doubt by putting the real panels on their actual roof in seconds.",
    bodyHighlights: ['looks nothing like their own', 'stall, keep shopping, and quietly disappear'],
    video: { src: '/videos/solar.mp4', poster: '/images/industries/solar.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual home, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their roof',
      body: 'Vizzion renders your real panels onto their real roof in seconds. They preview the panel styles you offer, each laid out at full scale on their own home.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the roof photo, and the exact panels they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to four other installers',
      'A race to the bottom on price before you even call',
      'Cold names that ghost half the time',
      'Paying $50 to $150 per shared lead, win or lose',
      'Starting at "can I come take a look at your roof?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm homeowners who already picked their panels',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which layout did you like best?"',
    ],
  },

  proof: {
    stats: [
      { target: 97, suffix: '%', label: 'of solar site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the installer down the street. Each one arrives with the homeowner's roof photo and the exact panels they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Your real panels are rendered onto their actual roof at full scale, in the real layout. It is what their home would look like, not a guess pulled from a stock photo of someone else's house.",
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
      a: 'There is a free tier to start, with plans that scale by visualization volume. One closed system typically covers it many times over. Get started to find the fit for your business.',
    },
  ],

  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vizzion Solar Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable solar visualization tool that helps solar installers generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of solar panels on their actual roof.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic solar panel visualization on homeowner photos',
      'Configurable solar panels and custom uploaded panels',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with roof photo and panel preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/solar.png',
    url: 'https://vizzion.io/industries/solar',
  },
};
