import { IndustryData } from '@/data/industries/types';

// Emits the per-industry product schema (WebApplication) defined in data.seo.schema.
// FAQPage and BreadcrumbList schema are emitted by their own components.
export default function IndustryStructuredData({ data }: { data: IndustryData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data.seo.schema) }}
    />
  );
}
