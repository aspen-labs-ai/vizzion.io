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
  | 'tattoos'
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
    h1: 'Roofing Visualizer Widget for Your Roofing Website',
    howToH2: 'How to Add a Roofing Visualizer Widget to Your Roofing Website',
    industryTerm: 'roofing',
    audienceTerm: 'roofing',
    article: 'a',
  },
  siding: {
    title: 'Siding Visualization Tool — Show Options on Real Homes | Vizzion',
    h1: 'Siding Visualizer Widget for Your Siding Website',
    howToH2: 'How to Add a Siding Visualizer Widget to Your Siding Website',
    industryTerm: 'siding',
    audienceTerm: 'siding',
    article: 'a',
  },
  solar: {
    title: 'Solar Panel Visualizer — Convert More Website Visitors | Vizzion',
    h1: 'Solar Visualizer Widget for Your Solar Website',
    howToH2: 'How to Add a Solar Visualizer Widget to Your Solar Website',
    industryTerm: 'solar',
    audienceTerm: 'solar',
    article: 'a',
  },
  'windows-doors': {
    title: 'Window & Door Visualizer Widget — Instant Lead Generation | Vizzion',
    h1: 'Window and Door Visualizer Widget for Your Window and Door Website',
    howToH2: 'How to Add a Window and Door Visualizer Widget to Your Window and Door Website',
    industryTerm: 'window and door',
    audienceTerm: 'window and door',
    article: 'a',
  },
  decking: {
    title: 'Deck Design Visualizer — Help Homeowners See the Result | Vizzion',
    h1: 'Deck Visualizer Widget for Your Decking Website',
    howToH2: 'How to Add a Deck Visualizer Widget to Your Decking Website',
    industryTerm: 'deck',
    audienceTerm: 'decking',
    article: 'a',
  },
  flooring: {
    title: 'Flooring Preview Widget — Visualize Before Installation | Vizzion',
    h1: 'Flooring Visualizer Widget for Your Flooring Website',
    howToH2: 'How to Add a Flooring Visualizer Widget to Your Flooring Website',
    industryTerm: 'flooring',
    audienceTerm: 'flooring',
    article: 'a',
  },
  countertops: {
    title: 'Countertop Visualizer — See Materials in Their Kitchen | Vizzion',
    h1: 'Countertop Visualizer Widget for Your Countertop Website',
    howToH2: 'How to Add a Countertop Visualizer Widget to Your Countertop Website',
    industryTerm: 'countertop',
    audienceTerm: 'countertop',
    article: 'a',
  },
  'garage-doors': {
    title: 'Garage Door Preview Tool — Boost Website Conversions | Vizzion',
    h1: 'Garage Door Visualizer Widget for Your Garage Door Website',
    howToH2: 'How to Add a Garage Door Visualizer Widget to Your Garage Door Website',
    industryTerm: 'garage door',
    audienceTerm: 'garage door',
    article: 'a',
  },
  fencing: {
    title: 'Fence Visualizer Widget — Show Options on Real Property | Vizzion',
    h1: 'Fencing Visualizer Widget for Your Fencing Website',
    howToH2: 'How to Add a Fencing Visualizer Widget to Your Fencing Website',
    industryTerm: 'fencing',
    audienceTerm: 'fencing',
    article: 'a',
  },
  gutters: {
    title: 'Gutter System Visualizer — Convert Browsers to Buyers | Vizzion',
    h1: 'Gutter Visualizer Widget for Your Gutter Website',
    howToH2: 'How to Add a Gutter Visualizer Widget to Your Gutter Website',
    industryTerm: 'gutter',
    audienceTerm: 'gutter',
    article: 'a',
  },
  shutters: {
    title: 'Shutter Preview Widget — See Styles on Actual Homes | Vizzion',
    h1: 'Shutter Visualizer Widget for Your Shutter Website',
    howToH2: 'How to Add a Shutter Visualizer Widget to Your Shutter Website',
    industryTerm: 'shutter',
    audienceTerm: 'shutter',
    article: 'a',
  },
  driveways: {
    title: 'Driveway Design Tool — Visualize Paving Options Instantly | Vizzion',
    h1: 'Driveway Visualizer Widget for Your Paving Website',
    howToH2: 'How to Add a Driveway Visualizer Widget to Your Paving Website',
    industryTerm: 'driveway',
    audienceTerm: 'paving',
    article: 'a',
  },
  'swimming-pools': {
    title: 'Pool Visualizer — Show Dream Pools in Real Backyards | Vizzion',
    h1: 'Pool Visualizer Widget for Your Pool Builder Website',
    howToH2: 'How to Add a Pool Visualizer Widget to Your Pool Builder Website',
    industryTerm: 'pool',
    audienceTerm: 'pool builder',
    article: 'a',
  },
  'artificial-turf': {
    title: 'Artificial Turf Preview — Transform Yards Virtually | Vizzion',
    h1: 'Artificial Turf Visualizer Widget for Your Turf Website',
    howToH2: 'How to Add an Artificial Turf Visualizer Widget to Your Turf Website',
    industryTerm: 'artificial turf',
    audienceTerm: 'turf',
    article: 'an',
  },
  tattoos: {
    title: 'Tattoo Preview Widget — Let Clients Visualize First | Vizzion',
    h1: 'Tattoo Visualizer Widget for Your Tattoo Studio Website',
    howToH2: 'How to Add a Tattoo Visualizer Widget to Your Tattoo Studio Website',
    industryTerm: 'tattoo',
    audienceTerm: 'tattoo studio',
    article: 'a',
  },
  'car-wraps': {
    title: 'Vehicle Wrap Visualizer — Preview Designs on Any Car | Vizzion',
    h1: 'Vehicle Wrap Visualizer Widget for Your Wrap Shop Website',
    howToH2: 'How to Add a Vehicle Wrap Visualizer Widget to Your Wrap Shop Website',
    industryTerm: 'vehicle wrap',
    audienceTerm: 'wrap shop',
    article: 'a',
  },
  'boat-decking': {
    title: 'Marine Decking Visualizer — Show Options on Real Boats | Vizzion',
    h1: 'Boat Decking Visualizer Widget for Your Marine Decking Website',
    howToH2: 'How to Add a Boat Decking Visualizer Widget to Your Marine Decking Website',
    industryTerm: 'boat decking',
    audienceTerm: 'marine decking',
    article: 'a',
  },
};

export const industrySlugs = Object.keys(industryKeywordConfigs) as IndustrySlug[];

export function buildIndustryMetaDescription(config: IndustryKeywordConfig): string {
  // Create unique meta descriptions based on industry-specific pain points
  const industryDescriptions: Record<string, string> = {
    roofing: `Add a roofing visualizer to your website. Let homeowners see new shingles, metal, or tile on their actual home before calling — capturing exclusive leads at 5-10x lower cost than aggregators.`,
    siding: `Transform browsers into buyers with a siding visualizer. Homeowners upload their photo, preview vinyl, fiber cement, or wood options instantly, then submit contact info to see results.`,
    solar: `Stop losing solar leads to uncertainty. Your website visualizer shows panels on their actual roof, closing the gap between curiosity and commitment. Capture exclusive leads 24/7.`,
    'window and door': `Window shopping becomes window buying. Let visitors visualize new windows and doors on their home photo, reducing decision paralysis and generating warm, exclusive leads.`,
    deck: `Help homeowners picture their dream deck. Your visualizer widget shows composite, wood, or PVC options on their actual yard — turning fence-sitters into qualified leads instantly.`,
    flooring: `Show flooring options in their actual space. Visitors upload a room photo, preview hardwood, tile, or luxury vinyl instantly, overcoming the visualization gap that kills conversions.`,
    countertop: `Let customers see granite, quartz, or marble in their kitchen before visiting your showroom. Capture high-intent leads by solving the "will it match?" question upfront.`,
    'garage door': `Boost curb appeal conversions. Homeowners preview new garage doors on their actual home, choosing styles and colors with confidence — then submit their info for exclusive follow-up.`,
    fencing: `End the guesswork in fence selection. Your website visitors see vinyl, wood, or aluminum options on their property photo, converting browsers into buyers with visual certainty.`,
    gutter: `Make gutter upgrades visible. Show how new gutters and guards look on their specific home, turning a grudge purchase into an excited buyer ready for your quote.`,
    shutter: `Style decisions made simple. Visitors upload their home, preview shutter styles and colors instantly, then submit contact info — giving you warm leads who've already fallen in love.`,
    driveway: `Visualize new driveways before breaking ground. Show concrete, asphalt, or paver options on their actual property, capturing leads who are ready to move forward with confidence.`,
    pool: `Turn pool dreams into pool leads. Let visitors see their backyard transformed with your pool designs, capturing contact info from excited buyers who can finally picture the result.`,
    'artificial turf': `Show the green without the maintenance. Visitors upload their yard, see realistic turf transformation instantly, then provide contact info — converting lawn frustration into sales opportunities.`,
    tattoo: `Preview before permanent. Let clients see tattoo designs on their actual body placement, building confidence and capturing bookings from visitors ready to commit to your artistry.`,
    'vehicle wrap': `See the wrap before the wrap. Vehicle owners preview custom designs on their exact car or truck model, turning tire kickers into committed customers ready for your quote.`,
    'boat decking': `Visualize marine makeovers instantly. Boat owners see teak, synthetic, or custom decking options on their vessel, capturing leads from buyers ready to upgrade their investment.`,
  };

  return industryDescriptions[config.industryTerm] || `Use ${config.article} ${config.industryTerm} visualizer widget on your ${config.audienceTerm} website. Let visitors preview options on their own photo and turn traffic into qualified leads.`;
}

export function buildIndustryHeroLead(config: IndustryKeywordConfig): string {
  return `Add ${config.article} ${config.industryTerm} visualizer widget to your ${config.audienceTerm} website in minutes. Visitors upload a photo, preview options, and submit their email for follow-up.`;
}
