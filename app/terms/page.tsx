import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCanonicalUrl } from '@/lib/seo/canonical';

export const metadata: Metadata = {
  title: 'Terms of Service | Vizzion',
  description: 'Terms of service for Vizzion and vizzion.io.',
  alternates: {
    canonical: getCanonicalUrl('/terms'),
  },
  openGraph: {
    title: 'Terms of Service | Vizzion',
    description: 'Terms of service for Vizzion and vizzion.io.',
    url: '/terms',
  },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 bg-bg-primary">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
            Terms of Service
          </h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              Effective date: February 15, 2026
            </p>
            <p>
              By using vizzion.io and the Vizzion product, you agree to use the service
              in compliance with applicable laws and these terms.
            </p>
            <p>
              You are responsible for content you upload, including rights to submitted
              images and marketing assets. You agree not to use the service for unlawful
              or abusive purposes.
            </p>
            <p>
              Service availability, pricing, and features may change over time. Continued
              use of the service after updates constitutes acceptance of revised terms.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
