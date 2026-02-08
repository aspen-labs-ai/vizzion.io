import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import ThreeSteps from '@/components/ThreeSteps';
import Platforms from '@/components/Platforms';
import Industries from '@/components/Industries';
import Dashboard from '@/components/Dashboard';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import SignupSection from '@/components/SignupSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vizzion — Turn Website Visitors Into Qualified Leads With Visual Product Previews',
  description: 'Embed Vizzion on your website and let customers see your products on their actual property, vehicle, or body. Captures email before showing the preview. Works for solar, wraps, tattoos, pools, turf, and more.',
  openGraph: {
    title: 'Vizzion — Turn Website Visitors Into Qualified Leads With Visual Product Previews',
    description: 'Embed Vizzion on your website and let customers see your products on their actual property, vehicle, or body. Captures email before showing the preview.',
    url: '/',
  },
  twitter: {
    title: 'Vizzion — Turn Website Visitors Into Qualified Leads With Visual Product Previews',
    description: 'Embed Vizzion on your website and let customers see your products on their actual property, vehicle, or body. Captures email before showing the preview.',
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SocialProof />
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
