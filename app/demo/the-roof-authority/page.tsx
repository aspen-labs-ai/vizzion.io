import type { Metadata } from 'next';
import DemoPage, { type DemoConfig } from '@/components/demo/DemoPage';

// Outreach demo for The Roof Authority. Branded with their logo but powered by
// the shared roofing demo widget ("Industry - Roofing" in the demo workspace),
// so no per-prospect backend setup is needed.
const config: DemoConfig = {
  companyName: 'The Roof Authority',
  logoUrl:
    'https://www.theroofauthority.com/wp-content/themes/mh_express/design/logo.png',
  embedKey: 'vwk_162d0183647767761ed6074b68f3c6ac054e',
  trade: 'roofing',
};

export const metadata: Metadata = {
  title: `${config.companyName} — Roofing Visualizer (Live Demo)`,
  description: 'Upload a photo and preview roofing styles on the building in seconds.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DemoPage config={config} />;
}
