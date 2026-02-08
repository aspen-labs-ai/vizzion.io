import type { IndustryData } from '@/data/industries/types';

export default function IndustryBreadcrumb({ data }: { data: IndustryData }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://vizzion.io/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Industries',
        item: 'https://vizzion.io/#industries',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.name,
        item: `https://vizzion.io/industries/${data.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
