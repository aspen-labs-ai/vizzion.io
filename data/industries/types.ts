export interface IndustryData {
  slug: string;
  name: string;
  shortName: string;
  iconName: string;
  metaTitle: string;
  metaDescription: string;

  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    primaryCTA: { text: string; href: string };
    secondaryCTA: { text: string; href: string };
  };

  problems: {
    headline: string;
    subheadline: string;
    items: Array<{
      icon: string;
      stat: string;
      description: string;
    }>;
  };

  solution: {
    headline: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
      iconName: string;
    }>;
  };

  howItWorks: {
    headline: string;
    steps: Array<{
      title: string;
      description: string;
      detail: string;
    }>;
  };

  benefits: Array<{
    metric: string;
    label: string;
    description: string;
    iconName: string;
  }>;

  testimonials: Array<{
    quote: string;
    author: string;
    handle: string;
    company: string;
    result: string;
  }>;

  comparison: {
    headline: string;
    oldWay: string[];
    vizzionWay: string[];
  };

  faq: Array<{
    question: string;
    answer: string;
  }>;

  seo: {
    keywords: string[];
    schema: Record<string, unknown>;
  };
}
