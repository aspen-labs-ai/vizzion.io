export type IndustrySlug =
  | 'roofing'
  | 'siding'
  | 'solar'
  | 'windows-doors'
  | 'decking'
  | 'flooring'
  | 'countertops'
  | 'garage-doors'
  | 'fencing'
  | 'gutters'
  | 'shutters'
  | 'driveways'
  | 'swimming-pools'
  | 'artificial-turf'
  | 'car-wraps'
  | 'boat-decking';

export interface IndustryKeywordConfig {
  title: string;
  h1: string;
  howToH2: string;
  industryTerm: string;
  audienceTerm: string;
  article: 'a' | 'an';
}

export const industryKeywordConfigs: Record<IndustrySlug, IndustryKeywordConfig> = {
  roofing: {
    title: 'Roofing Visualizer Widget — Preview Before You Buy | Vizzion',
    h1: 'Let Homeowners See Their New Roof Before You Quote',
    howToH2: 'How to Add a Roofing Visualizer Widget to Your Roofing Website',
    industryTerm: 'roofing',
    audienceTerm: 'roofing',
    article: 'a',
  },
  siding: {
    title: 'Siding Visualization Tool — Show Options on Real Homes | Vizzion',
    h1: 'Add a Siding Visualizer to Your Website — Capture More Leads',
    howToH2: 'How to Add a Siding Visualizer Widget to Your Siding Website',
    industryTerm: 'siding',
    audienceTerm: 'siding',
    article: 'a',
  },
  solar: {
    title: 'Solar Panel Visualizer — Convert More Website Visitors | Vizzion',
    h1: 'Help Buyers Picture Solar Panels on Their Roof',
    howToH2: 'How to Add a Solar Visualizer Widget to Your Solar Website',
    industryTerm: 'solar',
    audienceTerm: 'solar',
    article: 'a',
  },
  'windows-doors': {
    title: 'Window & Door Visualizer Widget — Instant Lead Generation | Vizzion',
    h1: 'Let Website Visitors Preview Windows & Doors on Their Home',
    howToH2: 'How to Add a Window and Door Visualizer Widget to Your Window and Door Website',
    industryTerm: 'window and door',
    audienceTerm: 'window and door',
    article: 'a',
  },
  decking: {
    title: 'Deck Design Visualizer — Help Homeowners See the Result | Vizzion',
    h1: 'Add a Deck Visualizer to Your Website — Turn Visitors Into Leads',
    howToH2: 'How to Add a Deck Visualizer Widget to Your Decking Website',
    industryTerm: 'deck',
    audienceTerm: 'decking',
    article: 'a',
  },
  flooring: {
    title: 'Flooring Preview Widget — Visualize Before Installation | Vizzion',
    h1: 'Let Customers See Flooring Options in Their Own Space',
    howToH2: 'How to Add a Flooring Visualizer Widget to Your Flooring Website',
    industryTerm: 'flooring',
    audienceTerm: 'flooring',
    article: 'a',
  },
  countertops: {
    title: 'Countertop Visualizer — See Materials in Their Kitchen | Vizzion',
    h1: 'Add a Countertop Visualizer to Your Site — Generate Qualified Leads',
    howToH2: 'How to Add a Countertop Visualizer Widget to Your Countertop Website',
    industryTerm: 'countertop',
    audienceTerm: 'countertop',
    article: 'a',
  },
  'garage-doors': {
    title: 'Garage Door Preview Tool — Boost Website Conversions | Vizzion',
    h1: 'Let Homeowners Preview Garage Doors on Their Actual Home',
    howToH2: 'How to Add a Garage Door Visualizer Widget to Your Garage Door Website',
    industryTerm: 'garage door',
    audienceTerm: 'garage door',
    article: 'a',
  },
  fencing: {
    title: 'Fence Visualizer Widget — Show Options on Real Property | Vizzion',
    h1: 'Add a Fence Visualizer to Your Website — Boost Conversions',
    howToH2: 'How to Add a Fencing Visualizer Widget to Your Fencing Website',
    industryTerm: 'fencing',
    audienceTerm: 'fencing',
    article: 'a',
  },
  gutters: {
    title: 'Gutter System Visualizer — Convert Browsers to Buyers | Vizzion',
    h1: 'Let Homeowners Visualize New Gutters on Their Home',
    howToH2: 'How to Add a Gutter Visualizer Widget to Your Gutter Website',
    industryTerm: 'gutter',
    audienceTerm: 'gutter',
    article: 'a',
  },
  shutters: {
    title: 'Shutter Preview Widget — See Styles on Actual Homes | Vizzion',
    h1: 'Add a Shutter Visualizer to Your Website — Generate More Leads',
    howToH2: 'How to Add a Shutter Visualizer Widget to Your Shutter Website',
    industryTerm: 'shutter',
    audienceTerm: 'shutter',
    article: 'a',
  },
  driveways: {
    title: 'Driveway Design Tool — Visualize Paving Options Instantly | Vizzion',
    h1: 'Let Property Owners Preview Paving Options on Their Driveway',
    howToH2: 'How to Add a Driveway Visualizer Widget to Your Paving Website',
    industryTerm: 'driveway',
    audienceTerm: 'paving',
    article: 'a',
  },
  'swimming-pools': {
    title: 'Pool Visualizer — Show Dream Pools in Real Backyards | Vizzion',
    h1: 'Add a Pool Visualizer to Your Website — Turn Dreamers Into Buyers',
    howToH2: 'How to Add a Pool Visualizer Widget to Your Pool Builder Website',
    industryTerm: 'pool',
    audienceTerm: 'pool builder',
    article: 'a',
  },
  'artificial-turf': {
    title: 'Artificial Turf Preview — Transform Yards Virtually | Vizzion',
    h1: 'Let Homeowners See Turf Transformation on Their Actual Yard',
    howToH2: 'How to Add an Artificial Turf Visualizer Widget to Your Turf Website',
    industryTerm: 'artificial turf',
    audienceTerm: 'turf',
    article: 'an',
  },
  'car-wraps': {
    title: 'Vehicle Wrap Visualizer — Preview Designs on Any Car | Vizzion',
    h1: 'Add a Vehicle Wrap Visualizer — Let Customers Preview Color Options',
    howToH2: 'How to Add a Vehicle Wrap Visualizer Widget to Your Wrap Shop Website',
    industryTerm: 'vehicle wrap',
    audienceTerm: 'wrap shop',
    article: 'a',
  },
  'boat-decking': {
    title: 'Marine Decking Visualizer — Show Options on Real Boats | Vizzion',
    h1: 'Let Boat Owners Visualize Decking Options on Their Vessel',
    howToH2: 'How to Add a Boat Decking Visualizer Widget to Your Marine Decking Website',
    industryTerm: 'boat decking',
    audienceTerm: 'marine decking',
    article: 'a',
  },
};

export const industrySlugs = Object.keys(industryKeywordConfigs) as IndustrySlug[];

export function buildIndustryMetaDescription(config: IndustryKeywordConfig): string {
  // Create unique meta descriptions based on industry-specific pain points
  // Concise meta descriptions (target 140-160 chars): keyword + benefit + soft CTA.
  const industryDescriptions: Record<string, string> = {
    roofing: `Add a roofing visualizer to your website. Homeowners preview shingles, metal, or tile on their own home and become exclusive, ready-to-quote leads.`,
    siding: `Add a siding visualizer to your website. Homeowners preview vinyl, fiber cement, or wood colors on their own home and become exclusive leads.`,
    solar: `Add a solar visualizer to your website. Homeowners see panels on their actual roof, closing the gap from curious to committed, and become exclusive leads.`,
    'window and door': `Add a window and door visualizer to your website. Visitors preview new windows and doors on their home photo and become warm, exclusive leads.`,
    deck: `Add a deck visualizer to your website. Homeowners preview composite, wood, or PVC on their own yard and become qualified, exclusive leads.`,
    flooring: `Add a flooring visualizer to your website. Visitors preview hardwood, tile, or luxury vinyl in their own room and become qualified, exclusive leads.`,
    countertop: `Add a countertop visualizer to your website. Customers preview granite, quartz, or marble in their own kitchen and become high-intent, exclusive leads.`,
    'garage door': `Add a garage door visualizer to your website. Homeowners preview new doors, styles, and colors on their actual home and become exclusive leads.`,
    fencing: `Add a fence visualizer to your website. Visitors preview vinyl, wood, or aluminum styles on their own property and become qualified, exclusive leads.`,
    gutter: `Add a gutter visualizer to your website. Homeowners see new gutters and guards on their specific home and become exclusive, ready-to-quote leads.`,
    shutter: `Add a shutter visualizer to your website. Visitors preview shutter styles and colors on their own home and become warm, exclusive leads.`,
    driveway: `Add a driveway visualizer to your website. Property owners preview pavers, concrete, or asphalt on their driveway and become confident, exclusive leads.`,
    pool: `Add a pool visualizer to your website. Visitors see your pool designs in their own backyard and become excited, exclusive leads ready for a quote.`,
    'artificial turf': `Add an artificial turf visualizer to your website. Homeowners see realistic turf on their actual yard and become qualified, exclusive leads.`,
    'vehicle wrap': `Add a vehicle wrap visualizer to your website. Customers preview wrap colors and finishes on their own car or truck and become qualified, exclusive leads.`,
    'boat decking': `Add a marine decking visualizer to your website. Boat owners preview teak, synthetic, or custom decking on their vessel and become exclusive leads.`,
  };

  return industryDescriptions[config.industryTerm] || `Use ${config.article} ${config.industryTerm} visualizer widget on your ${config.audienceTerm} website. Let visitors preview options on their own photo and turn traffic into qualified leads.`;
}

export function buildIndustryHeroLead(config: IndustryKeywordConfig): string {
  return `Add ${config.article} ${config.industryTerm} visualizer widget to your ${config.audienceTerm} website in minutes. Visitors upload a photo, preview options, and submit their email for follow-up.`;
}
