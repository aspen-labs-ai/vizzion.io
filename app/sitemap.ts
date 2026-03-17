import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vizzion.io';

  const industries = [
    'roofing',
    'siding',
    'solar',
    'windows-doors',
    'decking',
    'flooring',
    'countertops',
    'garage-doors',
    'fencing',
    'gutters',
    'shutters',
    'driveways',
    'swimming-pools',
    'artificial-turf',
    'car-wraps',
    'boat-decking',
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...industries.map((slug) => ({
      url: `${baseUrl}/industries/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
