import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import {
  buildIndustryMetaDescription,
  industryKeywordConfigs,
  type IndustrySlug,
} from '@/lib/seo/industry-keywords';

export function getIndustryMetadata(slug: IndustrySlug): Metadata {
  const config = industryKeywordConfigs[slug];
  const description = buildIndustryMetaDescription(config);
  const path = `/industries/${slug}`;

  return {
    title: config.title,
    description,
    alternates: {
      canonical: getCanonicalUrl(path),
    },
    openGraph: {
      title: config.title,
      description,
      url: path,
    },
    twitter: {
      title: config.title,
      description,
    },
  };
}
