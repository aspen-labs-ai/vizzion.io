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
  title: 'Embeddable Visualizer Widget for Business Websites | Vizzion',
  description: 'Add a visualizer widget to your website so visitors can preview products on their own photo and become qualified leads.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Embeddable Visualizer Widget for Business Websites | Vizzion',
    description: 'Add a visualizer widget to your website so visitors can preview products on their own photo and become qualified leads.',
    url: '/',
  },
  twitter: {
    title: 'Embeddable Visualizer Widget for Business Websites | Vizzion',
    description: 'Add a visualizer widget to your website so visitors can preview products on their own photo and become qualified leads.',
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
