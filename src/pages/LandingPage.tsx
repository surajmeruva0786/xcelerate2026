import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { QuickAccess } from '../components/QuickAccess';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <QuickAccess />
      </main>
      <Footer />
    </div>
  );
}