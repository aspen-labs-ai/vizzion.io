import { industryKeywordConfigs, industrySlugs } from '@/lib/seo/industry-keywords';

export const dynamic = 'force-static';

const SITE = 'https://vizzion.io';

export function GET() {
  const industryLines = industrySlugs
    .map((slug) => {
      const c = industryKeywordConfigs[slug];
      const label = c.title.replace(/\s*\|\s*Vizzion\s*$/, '');
      return `- [${label}](${SITE}/industries/${slug}): Let ${c.audienceTerm} website visitors preview ${c.industryTerm} options on a photo of their own home or property and become exclusive leads.`;
    })
    .join('\n');

  const body = `# Vizzion

> Vizzion is an embeddable visualization widget that home-improvement and visual-product businesses add to their website so customers can preview products on a photo of their own home, vehicle, or space — turning anonymous visitors into exclusive, ready-to-quote leads.

Vizzion installs with one line of code, needs no customer account, and works on WordPress, Wix, Squarespace, or any custom site. Each result is gated behind an email, so every saved preview becomes a lead the business owns outright — never shared or resold.

## Core pages
- [Vizzion home](${SITE}/): Product overview and how the visualization widget works.
- [Industries](${SITE}/industries): Every industry Vizzion supports.

## Industry visualizers
${industryLines}

## Contact
- Sales & support: hello@vizzion.io
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
