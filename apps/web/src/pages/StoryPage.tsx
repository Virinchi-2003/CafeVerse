import React from 'react';
import { Coffee, Award, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { StorySection } from '../components/StorySection';
import { Floating25DBackground } from '../components/Background25D';

export const StoryPage: React.FC = () => {
  return (
    <div className="py-16 px-4 bg-espresso-950 text-ivory space-y-16 relative overflow-hidden">
      <Floating25DBackground enableMouseParallax={true} />
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold">Our Heritage</span>
        <h1 className="font-serif text-5xl font-bold text-ivory">Crafting Moments Worth Slowing Down For.</h1>
        <p className="text-base text-ivory/70 leading-relaxed font-light">
          At CaféVerse, every bean is selected with intentionality and roasted to elevate natural flavors.
        </p>
      </div>

      <StorySection />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-3">
          <Award className="w-8 h-8 text-caramel-400" />
          <h3 className="font-serif text-xl font-bold text-ivory">Direct Trade</h3>
          <p className="text-xs text-ivory/70 leading-relaxed">
            We work directly with smallholder coffee farmers in Huila, Yirgacheffe, and Antigua, guaranteeing above fair-trade wages.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-3">
          <Coffee className="w-8 h-8 text-caramel-400" />
          <h3 className="font-serif text-xl font-bold text-ivory">Small Batch Roasting</h3>
          <p className="text-xs text-ivory/70 leading-relaxed">
            Roasted in small 5kg batches on our German cast-iron roaster to preserve delicate floral and caramel aroma notes.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-caramel-500/20 space-y-3">
          <Heart className="w-8 h-8 text-caramel-400" />
          <h3 className="font-serif text-xl font-bold text-ivory">Artisanal Bakery</h3>
          <p className="text-xs text-ivory/70 leading-relaxed">
            All pastries are laminated by hand using imported French butter and fermented 48 hours for crisp, flaky layers.
          </p>
        </div>
      </div>
    </div>
  );
};
