import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        login(res.token, res.user);
        onClose();
      } else {
        const res = await api.register({ email, password, name, phone });
        login(res.token, res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickAdmin = () => {
    setEmail('admin@cafeverse.com');
    setPassword('admin123');
    setMode('login');
  };

  const fillQuickCustomer = () => {
    setEmail('customer@cafeverse.com');
    setPassword('customer123');
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-md w-full p-6 sm:p-8 border border-caramel-500/40 relative space-y-6 shadow-25d text-ivory">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ivory/60 hover:text-ivory hover:bg-espresso-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 text-center">
          <h3 className="font-serif text-3xl font-bold text-ivory">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-ivory/60">
            {mode === 'login' ? 'Sign in to access your bookings and rewards' : 'Join CaféVerse for instant table reservations'}
          </p>
        </div>

        {/* Quick Demo Credentials Helpers */}
        <div className="p-3 rounded-2xl bg-espresso-900 border border-caramel-500/20 text-xs space-y-2">
          <p className="text-caramel-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Quick Demo Credentials:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="px-2.5 py-1 rounded-lg bg-caramel-500/20 border border-caramel-500/40 text-caramel-400 hover:bg-caramel-500 hover:text-espresso-950 font-bold transition-all text-[11px]"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={fillQuickCustomer}
              className="px-2.5 py-1 rounded-lg bg-espresso-800 border border-caramel-500/20 text-ivory/80 hover:bg-espresso-700 font-medium transition-all text-[11px]"
            >
              Fill Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-ivory/70 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-caramel-400/70" />
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ivory/70 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-caramel-400/70" />
              <input
                type="email"
                required
                placeholder="admin@cafeverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/70 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-caramel-400/70" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-ivory/70 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-caramel-400/70" />
                <input
                  type="tel"
                  placeholder="+1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-espresso-900 border border-caramel-500/30 text-ivory text-sm focus:outline-none focus:border-caramel-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-caramel-500 hover:bg-caramel-400 text-espresso-950 font-bold text-sm tracking-wide transition-all shadow-lg disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-caramel-500/10 text-xs">
          {mode === 'login' ? (
            <p className="text-ivory/60">
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-caramel-400 font-bold hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-ivory/60">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-caramel-400 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
