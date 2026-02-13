import { Header } from '../components/Header';
import { LeaderCards } from '../components/LeaderCards';
import { Hero } from '../components/Hero';
import { Departments } from '../components/Departments';
import { QuickAccess } from '../components/QuickAccess';
import { CTABand } from '../components/CTABand';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <LeaderCards />
        <Departments />
        <QuickAccess />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}