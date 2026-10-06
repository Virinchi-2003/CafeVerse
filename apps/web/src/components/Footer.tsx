import React from 'react';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-espresso-950 border-t border-caramel-500/20 text-ivory/70 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-caramel-500/10">
        
        {/* Brand info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <span className="font-serif text-2xl font-bold text-ivory">CaféVerse</span>
          </div>
          <p className="text-xs leading-relaxed font-light text-ivory/60">
            Your daily dose of specialty coffee, handcrafted pastry treats, and little moments worth slowing down for.
          </p>
          <div className="flex gap-4 text-caramel-400 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-caramel-300">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-caramel-300">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-caramel-300">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-ivory uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-caramel-400">Home</Link></li>
            <li><Link to="/menu" className="hover:text-caramel-400">Digital Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-caramel-400">Table Booking</Link></li>
            <li><Link to="/story" className="hover:text-caramel-400">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-caramel-400">Contact & Hours</Link></li>
          </ul>
        </div>

        {/* Hours */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-ivory uppercase tracking-wider">Opening Hours</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Mon – Thu:</span>
              <span className="text-caramel-400 font-mono">07:00 – 22:00</span>
            </div>
            <div className="flex justify-between">
              <span>Fri – Sat:</span>
              <span className="text-caramel-400 font-mono">07:00 – 23:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday:</span>
              <span className="text-caramel-400 font-mono">08:00 – 21:00</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-ivory uppercase tracking-wider">Visit Us</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-caramel-400 flex-shrink-0" />
              <span>42 Artisan Lane, Coffee Quarter, NY</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-caramel-400 flex-shrink-0" />
              <span>+1 (555) 234-5678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-caramel-400 flex-shrink-0" />
              <span>hello@cafeverse.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/40 gap-4">
        <p>© 2026 CaféVerse Specialty Roasts. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-caramel-400">Privacy Policy</a>
          <a href="#" className="hover:text-caramel-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
