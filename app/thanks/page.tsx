import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You — Vizzion',
  description: "Thanks for your interest in Vizzion. We'll be in touch soon.",
};

export default function ThanksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-primary flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Thanks! We'll be in touch soon.
          </h1>

          <p className="text-xl text-text-secondary mb-8">
            Check your email for next steps to get started with Vizzion. We typically respond within 24 hours.
          </p>

          <Link
            href="/"
            className="inline-block px-8 py-4 bg-accent hover:bg-accent-hover text-primary text-lg font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow hover:-translate-y-0.5"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
