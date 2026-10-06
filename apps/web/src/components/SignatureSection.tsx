import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Floating25DBackground } from './Background25D';

export const SignatureSection: React.FC = () => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMenuItems({ featuredOnly: true })
      .then(res => setFeaturedItems(res.items || []))
      .catch(err => console.error('Failed to load signature items:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-espresso-950 text-ivory relative overflow-hidden">
      <Floating25DBackground enableMouseParallax={true} />
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/10 border border-caramel-500/30 text-caramel-400 text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Perfection
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ivory">
            Crafted to Make Your Day.
          </h2>
          <p className="text-ivory/70 text-sm font-light">
            Discover our signature roasts and artisanal creations, brewed fresh daily by master baristas.
          </p>
        </div>

        {/* 2.5D Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-ivory/50 text-sm">Loading signature roasts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-5 border border-caramel-500/20 card-25d flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Image Composition */}
                <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-caramel-500/90 text-espresso-950 text-xs font-bold font-mono">
                    ₹{item.price}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <span className="text-[11px] uppercase tracking-wider text-caramel-400 font-semibold">
                    {item.categoryName || 'Signature Roast'}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ivory group-hover:text-caramel-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-ivory/70 line-clamp-2 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-caramel-500/20 flex items-center justify-between">
                  <span className="text-xs text-caramel-400 font-medium">Specialty Pick</span>
                  <button
                    onClick={() => navigate('/menu')}
                    className="p-2 rounded-full bg-caramel-500/20 text-caramel-400 hover:bg-caramel-500 hover:text-espresso-950 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
