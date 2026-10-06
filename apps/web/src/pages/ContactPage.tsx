import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    api.getSettings()
      .then(res => setSettings(res.settings))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="py-16 px-4 bg-espresso-950 text-ivory min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Get in Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ivory">Visit CaféVerse</h1>
          <p className="text-sm text-ivory/70 max-w-xl mx-auto">
            We are situated in the heart of the Coffee Quarter. Drop by for a cup or drop us a note.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Card */}
          <div className="lg:col-span-5 glass-card p-8 rounded-3xl border border-caramel-500/30 space-y-6 shadow-25d">
            <h3 className="font-serif text-2xl font-bold text-ivory">Café Information</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-caramel-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ivory">Address</p>
                  <p className="text-xs text-ivory/70">{settings?.address || '42 Artisan Lane, Coffee Quarter, NY 10001'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-caramel-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ivory">Phone</p>
                  <p className="text-xs text-ivory/70">{settings?.phone || '+1 (555) 234-5678'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-caramel-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ivory">Email</p>
                  <p className="text-xs text-ivory/70">{settings?.email || 'hello@cafeverse.com'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-caramel-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ivory">Opening Hours</p>
                  <div className="text-xs text-ivory/70 space-y-1 mt-1">
                    <p>Mon - Thu: 07:00 – 22:00</p>
                    <p>Fri - Sat: 07:00 – 23:00</p>
                    <p>Sun: 08:00 – 21:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="lg:col-span-7 glass-card p-8 rounded-3xl border border-caramel-500/30 space-y-6 shadow-25d">
            <h3 className="font-serif text-2xl font-bold text-ivory">Send Us a Message</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for reaching out! We will reply shortly.'); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Your Name</label>
                  <input type="text" required placeholder="Elena" className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-ivory/60 mb-1">Email</label>
                  <input type="email" required placeholder="elena@example.com" className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Subject</label>
                <input type="text" required placeholder="Private Events / Inquiry" className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm" />
              </div>

              <div>
                <label className="block text-xs text-ivory/60 mb-1">Message</label>
                <textarea required rows={4} placeholder="How can we assist you?" className="w-full px-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm" />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
