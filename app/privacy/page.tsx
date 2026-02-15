import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCanonicalUrl } from '@/lib/seo/canonical';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vizzion',
  description: 'Privacy policy for Vizzion and vizzion.io.',
  alternates: {
    canonical: getCanonicalUrl('/privacy'),
  },
  openGraph: {
    title: 'Privacy Policy | Vizzion',
    description: 'Privacy policy for Vizzion and vizzion.io.',
    url: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 bg-bg-primary">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              Effective date: February 15, 2026
            </p>
            <p>
              Vizzion collects contact information and usage events required to deliver
              product previews, route leads, and operate the service. We use this data to
              provide the product, improve reliability, and support customer accounts.
            </p>
            <p>
              We do not sell personal information. Data may be shared with trusted service
              providers that support hosting, analytics, email delivery, and CRM integrations.
            </p>
            <p>
              If you need data access, correction, or deletion support, contact us using the
              contact link on this website.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
