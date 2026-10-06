import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Floating25DBackground } from './Background25D';

interface CoffeePick {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  description: string;
  image: string;
}

const COFFEE_ITEMS: CoffeePick[] = [
  {
    id: 'mocha',
    name: 'Mocha',
    price: '₹219',
    numericPrice: 219,
    description: 'Rich dark Belgian chocolate melted into single-origin double espresso with steamed silk milk.',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: '₹169',
    numericPrice: 169,
    description: 'Double shot espresso topped with dense, velvety micro-foam and a dusting of dark cocoa.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668ba67e53?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'latte',
    name: 'Latte',
    price: '₹199',
    numericPrice: 199,
    description: 'Smooth and creamy espresso with steamed milk and a light foam with hand-poured art.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'espresso',
    name: 'Espresso',
    price: '₹129',
    numericPrice: 129,
    description: 'Aromatic Ethiopian single-origin double shot with thick golden crema and citrus notes.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'coldbrew',
    name: 'Cold Brew',
    price: '₹179',
    numericPrice: 179,
    description: '24-hour slow steeped specialty cold brew served cascading on tap with zero bitterness.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop'
  }
];



export const Hero25D: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeePick>(COFFEE_ITEMS[2]); // Default Latte

  return (
    <section
      className="relative min-h-[94vh] flex items-center justify-center overflow-hidden bg-espresso-950 text-ivory py-12 px-4"
    >
      {/* Ambient Radial Spotlight Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-caramel-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-espresso-800/30 rounded-full blur-[120px] pointer-events-none" />

      {/* 2.5D ANIMATED DARK CHOCOLATE PIECES & COFFEE BEANS BACKGROUND LAYER */}
      <Floating25DBackground enableMouseParallax={true} />

      {/* Main 2.5D Container (Steady & Centered) */}
      <div
        className="relative z-20 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Left Editorial Headline Section */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-400 text-xs font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" /> Specialty Roasts Daily
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-ivory leading-[1.1]"
          >
            Great <br />
            <span className="italic font-normal text-caramel-400">moments.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-ivory/70 text-base leading-relaxed max-w-md font-light"
          >
            Brewed to make your day a little better. Freshly extracted espresso, velvety micro-foam, and handcrafted treats.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={() => navigate('/reservations')}
              className="px-6 py-3.5 rounded-full bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide transition-all shadow-25d hover:shadow-caramel-500/30 flex items-center gap-2 group"
            >
              <Calendar className="w-4 h-4" />
              Reserve a Table
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Center 2.5D Animated Coffee Cup Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
          
          {/* Steam particle animation container */}
          <div className="absolute -top-12 z-30 flex gap-4 pointer-events-none">
            <div className="steam-particle left-0" style={{ animationDelay: '0s' }} />
            <div className="steam-particle left-4" style={{ animationDelay: '1.2s' }} />
            <div className="steam-particle left-8" style={{ animationDelay: '0.6s' }} />
          </div>

          {/* Central Animated Cup */}
          <motion.div
            key={selectedCoffee.id}
            initial={{ scale: 0.85, opacity: 0, rotateZ: -5 }}
            animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-20 w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center"
          >
            {/* Soft Ambient Halo Shadow */}
            <div className="absolute inset-0 bg-caramel-500/25 rounded-full blur-2xl transform scale-110" />

            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-caramel-500/40 shadow-25d group">
              <img
                src={selectedCoffee.image}
                alt={selectedCoffee.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Cup Shadow Base */}
          <div className="w-64 h-8 bg-black/60 rounded-full blur-md mt-4 transform scale-x-125" />

          {/* Interactive Coffee Carousel / Selector (Inspired by Image 1) */}
          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto max-w-full px-2 py-2 relative z-30">
            {COFFEE_ITEMS.map((item) => {
              const isSelected = selectedCoffee.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCoffee(item)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-caramel-500/25 border-2 border-caramel-400 scale-110 shadow-lg'
                      : 'bg-espresso-900/60 border border-caramel-500/20 hover:border-caramel-500/50 hover:bg-espresso-900'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-caramel-500/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-xs font-medium ${isSelected ? 'text-caramel-400 font-bold' : 'text-ivory/70'}`}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-caramel-400/90 font-mono">
                    {item.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* BUY NOW Button below selector */}
          <button
            onClick={() => navigate('/menu')}
            className="mt-6 px-8 py-3 rounded-full bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-25d hover:shadow-25d-hover transition-all transform hover:-translate-y-0.5 relative z-30"
          >
            <ShoppingBag className="w-4 h-4" />
            BUY NOW
          </button>
        </div>

        {/* Right "Current Pick" Detail Card */}
        <div className="lg:col-span-3 text-left">
          <motion.div
            key={selectedCoffee.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 rounded-3xl border border-caramel-500/30 shadow-25d space-y-4"
          >
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold">
                Current Pick
              </span>
              <h3 className="font-serif text-3xl font-bold text-ivory">
                {selectedCoffee.name}
              </h3>
            </div>

            <p className="text-sm text-ivory/75 leading-relaxed font-light">
              {selectedCoffee.description}
            </p>

            <div className="pt-2 border-t border-caramel-500/20 flex items-baseline justify-between">
              <span className="text-xs text-ivory/60">Price per cup</span>
              <span className="font-serif text-3xl font-bold text-caramel-400">
                {selectedCoffee.price}
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
