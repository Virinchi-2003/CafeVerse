import React from 'react';
import { Hero25D } from '../components/Hero25D';
import { SignatureSection } from '../components/SignatureSection';
import { StorySection } from '../components/StorySection';
import { ReservationSection } from '../components/ReservationSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { ArrowRight, Coffee, Croissant, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      {/* 2.5D Animated Hero Inspired by Image 1 */}
      <Hero25D />

      {/* Signature Specialty Drinks */}
      <SignatureSection />

      {/* Quick Category Highlights Banner */}
      <section className="py-16 px-4 bg-espresso-900/60 border-y border-caramel-500/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles className="w-3.5 h-3.5" /> Full Menu Available Online
            </span>
            <h2 className="font-serif text-3xl font-bold text-ivory">Explore Artisan Pastries & Cold Brews</h2>
            <p className="text-xs text-ivory/70 max-w-lg">From French butter almond croissants to 24-hour slow steeped nitrogen cold brew on tap.</p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="px-8 py-3.5 rounded-full bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide shadow-25d flex items-center gap-2 transition-all flex-shrink-0"
          >
            Explore Digital Menu
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Story Section */}
      <StorySection />

      {/* 2.5D Reservation Wizard Inspired by Image 2 */}
      <ReservationSection />

      {/* Customer Reviews */}
      <ReviewsSection />
    </div>
  );
};
