import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import WidgetExperience from '@/components/WidgetExperience';
import ThreeSteps from '@/components/ThreeSteps';
import Platforms from '@/components/Platforms';
import Industries from '@/components/Industries';
import Dashboard from '@/components/Dashboard';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import SignupSection from '@/components/SignupSection';
import Footer from '@/components/Footer';
import { getCanonicalUrl } from '@/lib/seo/canonical';

export const metadata: Metadata = {
  title: 'Vizzion — Visual Lead Generation for Any Industry',
  description: 'Embed Vizzion on your site and let customers preview products on their property, vehicle, or body. Captures emails before showing the result.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Vizzion — Visual Lead Generation for Any Industry',
    description: 'Embed Vizzion on your site and let customers preview products on their property, vehicle, or body. Captures emails before showing the result.',
    url: '/',
  },
  twitter: {
    title: 'Vizzion — Visual Lead Generation for Any Industry',
    description: 'Embed Vizzion on your site and let customers preview products on their property, vehicle, or body. Captures emails before showing the result.',
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <WidgetExperience />
        <ThreeSteps />
        <Platforms />
        <Industries />
        <Dashboard />
        <Testimonials />
        <Pricing />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
