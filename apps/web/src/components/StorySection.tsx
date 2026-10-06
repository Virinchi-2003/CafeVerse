import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Award, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Floating25DBackground } from './Background25D';

export const StorySection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-espresso-950 text-ivory relative overflow-hidden border-t border-caramel-500/10">
      <Floating25DBackground enableMouseParallax={true} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Layered 2.5D Image Composition */}
        <div className="lg:col-span-6 relative perspective-container">
          <motion.div
            initial={{ opacity: 0, rotateY: -15 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10 rounded-3xl overflow-hidden shadow-25d border border-caramel-500/30"
          >
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1000&auto=format&fit=crop"
              alt="Artisan Barista Pour"
              className="w-full h-[420px] object-cover"
            />
          </motion.div>

          {/* Floating Foreground Layer */}
          <motion.div
            initial={{ opacity: 0, y: 40, x: 40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute -bottom-8 -right-4 z-20 w-64 glass-card p-4 rounded-2xl border border-caramel-500/40 shadow-25d hidden sm:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-ivory">Ethically Sourced</p>
                <p className="text-[11px] text-ivory/60">100% Single Origin Beans</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Editorial Text Content */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold">
            Our Philosophy
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ivory leading-tight">
            Every Cup Tells a Story of Passion & Patience.
          </h2>

          <p className="text-ivory/70 text-sm leading-relaxed font-light">
            Founded with a conviction that coffee should be an experience rather than a routine. We partner directly with micro-lot farmers across Ethiopia, Colombia, and Guatemala to source beans roasted to highlight their innate terroir.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-espresso-900/60 border border-caramel-500/20 space-y-1">
              <span className="font-serif text-3xl font-bold text-caramel-400">100%</span>
              <p className="text-xs text-ivory/70">Organic Arabica</p>
            </div>
            <div className="p-4 rounded-2xl bg-espresso-900/60 border border-caramel-500/20 space-y-1">
              <span className="font-serif text-3xl font-bold text-caramel-400">48 hrs</span>
              <p className="text-xs text-ivory/70">Roast to Brew Freshness</p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/story"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-caramel-500/40 text-caramel-400 font-semibold text-sm hover:bg-caramel-500 hover:text-espresso-950 transition-all"
            >
              Read Our Full Story
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
