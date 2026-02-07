export interface IndustryData {
  slug: string;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;

  header: {
    badge: string;
    headline: string;
    highlightWord: string;
    intro: string;
    introHighlight?: string;
    cta: { text: string; href: string };
  };

  context: {
    headline: string;
    paragraphs: string[];
    highlights?: string[];
    callout?: {
      stat: string;
      text: string;
    };
  };

  showcase?: {
    headline: string;
    subtext?: string;
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
  };

  solution: {
    headline: string;
    intro: string;
    points: Array<{
      title: string;
      description: string;
    }>;
  };

  howItWorks: {
    headline: string;
    intro: string;
    steps: Array<{
      number: number;
      title: string;
      description: string;
    }>;
  };

  benefits: Array<{
    metric: string;
    label: string;
    description: string;
  }>;

  comparison: {
    headline: string;
    oldWay: string[];
    vizzionWay: string[];
  };

  testimonials: Array<{
    quote: string;
    author: string;
    company: string;
    result: string;
  }>;

  faq: Array<{
    question: string;
    answer: string;
  }>;

  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
    href: string;
  };

  seo: {
    keywords: string[];
    schema: Record<string, unknown>;
  };
}
