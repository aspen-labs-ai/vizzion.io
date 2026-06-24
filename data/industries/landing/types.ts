// Data contract for the v3 industry landing template (components/industries/landing).
// One object per industry drives the entire page; visuals (hero demo, gap video,
// material renders) are optional so pages render cleanly before assets exist.

export interface LandingStep {
  title: string;
  body: string;
  badge: string;
}

export interface LandingStat {
  target: number;
  prefix?: string;
  suffix?: string;
  dec?: number;
  label: string;
}

export interface LandingMaterial {
  key: string;
  name: string;
  swatch: string; // any CSS background value (gradient/color)
  image: string; // public path to the rendered material image
}

export interface IndustryLandingData {
  slug: string;
  name: string;
  shortName: string;

  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    sub: string;
    demo: 'widget' | 'photo'; // 'widget' = animated WidgetMockup (roofing), 'photo' = industry photo in browser frame
    demoAddress?: string; // browser address-bar text
  };

  gap: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    body: string;
    bodyHighlights?: string[];
    video?: { src: string; poster?: string };
  };

  steps: LandingStep[]; // 3

  vs: {
    old: string[]; // 5
    new: string[]; // 5
  };

  materials?: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    body: string;
    items: LandingMaterial[];
  };

  proof: {
    stats: LandingStat[]; // 4
  };

  faq: Array<{ q: string; a: string }>; // ~5

  schema?: Record<string, unknown>; // WebApplication JSON-LD
}
