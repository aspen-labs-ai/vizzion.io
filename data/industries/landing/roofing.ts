import type { IndustryLandingData } from './types';

export const roofingLanding: IndustryLandingData = {
  slug: 'roofing',
  name: 'Roofing',
  shortName: 'Roofing',

  hero: {
    eyebrow: 'Roofing visualizer widget',
    headline: 'Turn website lookers into',
    headlineAccent: 'booked roofs.',
    sub: 'Vizzion is a roofing visualizer for your website: homeowners see real shingles, metal, tile, and slate on their actual house, and every saved preview lands in your inbox as an exclusive lead.',
    demo: 'widget',
    demoAddress: 'yourroofingco.com',
  },

  gap: {
    eyebrow: 'The visualization gap',
    headline: "A 3-inch sample can't sell an",
    headlineAccent: 'entire roof.',
    body: "The roof is the biggest thing anyone sees on a home, and the single hardest thing to picture changing. A palm-sized swatch or a stock photo of someone else's house never answers the only question that matters: what will it look like on mine? So homeowners stall, keep shopping, and quietly disappear. Vizzion erases that doubt by rendering the real material on their real roof.",
    bodyHighlights: ["someone else's house"],
    video: { src: '/roofing-v3/cant-picture-it.mp4', poster: '/roofing-v3/swatch-poster.png' },
  },

  steps: [
    {
      title: 'They upload a photo',
      body: 'A homeowner drops in a photo of their actual house, right on your site. No app, no signup, no friction.',
      badge: 'PHONE PHOTO, NO APP',
    },
    {
      title: 'They see it on their roof',
      body: 'Vizzion renders real materials onto their real roof in seconds. They preview shingles, metal, tile, and slate, each shown at full scale on their home.',
      badge: 'RENDERED IN SECONDS',
    },
    {
      title: 'They become your lead',
      body: 'To save or share the look they enter their email. You get their name, the roof photo, and the exact material they loved, sent straight to you.',
      badge: 'STRAIGHT TO YOUR INBOX OR CRM',
    },
  ],

  vs: {
    old: [
      'The same lead sold to four other contractors',
      'A race to the bottom on price before you even call',
      'Cold names that ghost half the time',
      'Paying per lead, win or lose, forever',
      'Starting at "can I come measure your roof?"',
    ],
    new: [
      'Exclusive leads that are yours alone, never resold',
      'Captured from traffic you already paid to get',
      'Warm homeowners who already picked a material',
      'A flat tool cost, not a tax on every lead',
      'Starting at "which option did you like best?"',
    ],
  },

  materials: {
    eyebrow: 'One house, every roof',
    headline: 'Any material.',
    headlineAccent: 'On their actual house.',
    body: 'Same roofline, every material you offer. Load the lines you actually carry — GAF, Owens Corning, or CertainTeed architectural shingles, standing-seam metal, clay tile, and natural slate — and homeowners preview the looks that matter to them on their own roof. Every saved preview is your lead.',
    items: [
      { key: 'shingle', name: 'Architectural shingle', swatch: 'linear-gradient(135deg,#3b3f46,#1f2228)', image: '/roofing-v3/roof-architectural-shingle.png' },
      { key: 'metal', name: 'Standing-seam metal', swatch: 'linear-gradient(135deg,#8a5a2b,#5e3c1c)', image: '/roofing-v3/roof-standing-seam-metal.png' },
      { key: 'cedar', name: 'Cedar wood shake', swatch: 'linear-gradient(135deg,#9a6b3f,#6a4423)', image: '/roofing-v3/roof-cedar-shake.png' },
      { key: 'slate', name: 'Natural slate', swatch: 'linear-gradient(135deg,#5b6470,#363d47)', image: '/roofing-v3/roof-slate.png' },
      { key: 'clay', name: 'Clay tile', swatch: 'linear-gradient(135deg,#b4633a,#7e3f23)', image: '/roofing-v3/roof-clay-tile.png' },
    ],
  },

  proof: {
    stats: [
      { target: 95, suffix: '%', label: 'of site visitors typically leave without asking for a quote' },
      { target: 5, prefix: '<', suffix: ' min', label: 'from pasting the code to a live visualizer' },
      { target: 0, prefix: '$', label: 'in per-lead fees, ever; plans are flat' },
      { target: 100, suffix: '%', label: 'of leads are exclusively yours, never shared or resold' },
    ],
  },

  faq: [
    {
      q: 'Do I own the leads?',
      a: "Yes, 100% exclusive. Every lead comes from your own website and goes only to you, never shared, never resold, never auctioned to the contractor down the street. Each one arrives with the homeowner's roof photo and the exact material they chose.",
    },
    {
      q: 'How accurate is the preview?',
      a: "Real materials are rendered onto their actual roofline in true color and style, at full scale. It is what their house would look like, not a guess pulled from a 3-inch chip or a stock photo of someone else's home.",
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
    name: 'Vizzion Roofing Visualization Widget',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Embeddable roofing visualization tool that helps roofing contractors generate exclusive, pre-qualified leads from their own website traffic. Homeowners see realistic previews of shingles, metal, tile, and slate on their actual roof.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available. Premium plans based on visualization volume.',
    },
    featureList: [
      'Realistic roof material visualization on homeowner photos',
      'Configurable roofing products and custom uploaded materials',
      'Embeddable website widget',
      'White-label branding',
      'Optional CRM integration',
      'Lead capture with roof photo and material preference',
      '5-minute setup',
    ],
    screenshot: 'https://vizzion.io/images/industries/roofing.png',
    url: 'https://vizzion.io/industries/roofing',
  },
};
