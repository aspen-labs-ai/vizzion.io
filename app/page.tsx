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
