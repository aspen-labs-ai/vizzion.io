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
    title: 'Roofing Visualizer Widget for Roofing Websites | Vizzion',
    h1: 'Roofing Visualizer Widget for Your Roofing Website',
    howToH2: 'How to Add a Roofing Visualizer Widget to Your Roofing Website',
    industryTerm: 'roofing',
    audienceTerm: 'roofing',
    article: 'a',
  },
  siding: {
    title: 'Siding Visualizer Widget for Siding Websites | Vizzion',
    h1: 'Siding Visualizer Widget for Your Siding Website',
    howToH2: 'How to Add a Siding Visualizer Widget to Your Siding Website',
    industryTerm: 'siding',
    audienceTerm: 'siding',
    article: 'a',
  },
  solar: {
    title: 'Solar Visualizer Widget for Solar Websites | Vizzion',
    h1: 'Solar Visualizer Widget for Your Solar Website',
    howToH2: 'How to Add a Solar Visualizer Widget to Your Solar Website',
    industryTerm: 'solar',
    audienceTerm: 'solar',
    article: 'a',
  },
  'windows-doors': {
    title: 'Window and Door Visualizer Widget for Window and Door Websites | Vizzion',
    h1: 'Window and Door Visualizer Widget for Your Window and Door Website',
    howToH2: 'How to Add a Window and Door Visualizer Widget to Your Window and Door Website',
    industryTerm: 'window and door',
    audienceTerm: 'window and door',
    article: 'a',
  },
  decking: {
    title: 'Deck Visualizer Widget for Decking Websites | Vizzion',
    h1: 'Deck Visualizer Widget for Your Decking Website',
    howToH2: 'How to Add a Deck Visualizer Widget to Your Decking Website',
    industryTerm: 'deck',
    audienceTerm: 'decking',
    article: 'a',
  },
  flooring: {
    title: 'Flooring Visualizer Widget for Flooring Websites | Vizzion',
    h1: 'Flooring Visualizer Widget for Your Flooring Website',
    howToH2: 'How to Add a Flooring Visualizer Widget to Your Flooring Website',
    industryTerm: 'flooring',
    audienceTerm: 'flooring',
    article: 'a',
  },
  countertops: {
    title: 'Countertop Visualizer Widget for Countertop Websites | Vizzion',
    h1: 'Countertop Visualizer Widget for Your Countertop Website',
    howToH2: 'How to Add a Countertop Visualizer Widget to Your Countertop Website',
    industryTerm: 'countertop',
    audienceTerm: 'countertop',
    article: 'a',
  },
  'garage-doors': {
    title: 'Garage Door Visualizer Widget for Garage Door Websites | Vizzion',
    h1: 'Garage Door Visualizer Widget for Your Garage Door Website',
    howToH2: 'How to Add a Garage Door Visualizer Widget to Your Garage Door Website',
    industryTerm: 'garage door',
    audienceTerm: 'garage door',
    article: 'a',
  },
  fencing: {
    title: 'Fencing Visualizer Widget for Fencing Websites | Vizzion',
    h1: 'Fencing Visualizer Widget for Your Fencing Website',
    howToH2: 'How to Add a Fencing Visualizer Widget to Your Fencing Website',
    industryTerm: 'fencing',
    audienceTerm: 'fencing',
    article: 'a',
  },
  gutters: {
    title: 'Gutter Visualizer Widget for Gutter Websites | Vizzion',
    h1: 'Gutter Visualizer Widget for Your Gutter Website',
    howToH2: 'How to Add a Gutter Visualizer Widget to Your Gutter Website',
    industryTerm: 'gutter',
    audienceTerm: 'gutter',
    article: 'a',
  },
  shutters: {
    title: 'Shutter Visualizer Widget for Shutter Websites | Vizzion',
    h1: 'Shutter Visualizer Widget for Your Shutter Website',
    howToH2: 'How to Add a Shutter Visualizer Widget to Your Shutter Website',
    industryTerm: 'shutter',
    audienceTerm: 'shutter',
    article: 'a',
  },
  driveways: {
    title: 'Driveway Visualizer Widget for Paving Websites | Vizzion',
    h1: 'Driveway Visualizer Widget for Your Paving Website',
    howToH2: 'How to Add a Driveway Visualizer Widget to Your Paving Website',
    industryTerm: 'driveway',
    audienceTerm: 'paving',
    article: 'a',
  },
  'swimming-pools': {
    title: 'Pool Visualizer Widget for Pool Builder Websites | Vizzion',
    h1: 'Pool Visualizer Widget for Your Pool Builder Website',
    howToH2: 'How to Add a Pool Visualizer Widget to Your Pool Builder Website',
    industryTerm: 'pool',
    audienceTerm: 'pool builder',
    article: 'a',
  },
  'artificial-turf': {
    title: 'Artificial Turf Visualizer Widget for Turf Websites | Vizzion',
    h1: 'Artificial Turf Visualizer Widget for Your Turf Website',
    howToH2: 'How to Add an Artificial Turf Visualizer Widget to Your Turf Website',
    industryTerm: 'artificial turf',
    audienceTerm: 'turf',
    article: 'an',
  },
  tattoos: {
    title: 'Tattoo Visualizer Widget for Tattoo Studio Websites | Vizzion',
    h1: 'Tattoo Visualizer Widget for Your Tattoo Studio Website',
    howToH2: 'How to Add a Tattoo Visualizer Widget to Your Tattoo Studio Website',
    industryTerm: 'tattoo',
    audienceTerm: 'tattoo studio',
    article: 'a',
  },
  'car-wraps': {
    title: 'Vehicle Wrap Visualizer Widget for Wrap Shop Websites | Vizzion',
    h1: 'Vehicle Wrap Visualizer Widget for Your Wrap Shop Website',
    howToH2: 'How to Add a Vehicle Wrap Visualizer Widget to Your Wrap Shop Website',
    industryTerm: 'vehicle wrap',
    audienceTerm: 'wrap shop',
    article: 'a',
  },
  'boat-decking': {
    title: 'Boat Decking Visualizer Widget for Marine Decking Websites | Vizzion',
    h1: 'Boat Decking Visualizer Widget for Your Marine Decking Website',
    howToH2: 'How to Add a Boat Decking Visualizer Widget to Your Marine Decking Website',
    industryTerm: 'boat decking',
    audienceTerm: 'marine decking',
    article: 'a',
  },
};

export const industrySlugs = Object.keys(industryKeywordConfigs) as IndustrySlug[];

export function buildIndustryMetaDescription(config: IndustryKeywordConfig): string {
  return `Use ${config.article} ${config.industryTerm} visualizer widget on your ${config.audienceTerm} website. Let visitors preview options on their own photo and turn traffic into qualified leads.`;
}

export function buildIndustryHeroLead(config: IndustryKeywordConfig): string {
  return `Add ${config.article} ${config.industryTerm} visualizer widget to your ${config.audienceTerm} website in minutes. Visitors upload a photo, preview options, and submit their email for follow-up.`;
}
