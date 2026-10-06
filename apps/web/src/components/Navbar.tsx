import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Search, User as UserIcon, LogOut, Shield, Calendar, Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ themeMode, onToggleTheme, onOpenAuthModal }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md bg-espresso-950/80 border-b border-caramel-500/20 text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand / Logo inspired by Image 1 */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-caramel-500/20 border border-caramel-500/40 flex items-center justify-center text-caramel-400 group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-ivory group-hover:text-caramel-400 transition-colors">
                CaféVerse
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-caramel-500/80 font-medium">
                Made For Coffee Lovers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-caramel-400 ${isActive('/') ? 'text-caramel-400 border-b-2 border-caramel-500 pb-1' : 'text-ivory/80'}`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`transition-colors hover:text-caramel-400 ${isActive('/menu') ? 'text-caramel-400 border-b-2 border-caramel-500 pb-1' : 'text-ivory/80'}`}
            >
              Menu
            </Link>
            <Link
              to="/story"
              className={`transition-colors hover:text-caramel-400 ${isActive('/story') ? 'text-caramel-400 border-b-2 border-caramel-500 pb-1' : 'text-ivory/80'}`}
            >
              Our Story
            </Link>
            <Link
              to="/reservations"
              className={`transition-colors hover:text-caramel-400 ${isActive('/reservations') ? 'text-caramel-400 border-b-2 border-caramel-500 pb-1' : 'text-ivory/80'}`}
            >
              Reservations
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-caramel-400 ${isActive('/contact') ? 'text-caramel-400 border-b-2 border-caramel-500 pb-1' : 'text-ivory/80'}`}
            >
              Contact
            </Link>
          </div>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-ivory/70 hover:text-caramel-400 hover:bg-espresso-800/50 transition-all"
              title="Toggle Theme"
            >
              {themeMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-caramel-500/30 bg-espresso-800/40 hover:bg-espresso-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-caramel-500 text-espresso-950 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-ivory max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-espresso-900 border border-caramel-500/30 rounded-xl shadow-25d py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-espresso-800">
                      <p className="font-semibold text-ivory">{user.name}</p>
                      <p className="text-xs text-caramel-400/80 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-caramel-400 hover:bg-espresso-800 transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Admin Portal
                      </Link>
                    )}

                    <Link
                      to="/my-reservations"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-ivory/90 hover:bg-espresso-800 transition-colors"
                    >
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-espresso-800 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2 text-sm font-medium text-ivory/90 hover:text-caramel-400 transition-colors rounded-full border border-caramel-500/30 hover:border-caramel-500/60"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-5 py-2 text-sm font-semibold bg-caramel-500 hover:bg-caramel-400 text-espresso-950 transition-all rounded-full shadow-md hover:shadow-caramel-500/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & User Profile Controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-ivory/80 hover:text-caramel-400 hover:bg-espresso-800/60 transition-all"
              title="Toggle Theme"
            >
              {themeMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user && (
              <div className="w-7 h-7 rounded-full bg-caramel-500 text-espresso-950 font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ivory hover:bg-espresso-800/80 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-espresso-900/95 backdrop-blur-xl border-b border-caramel-500/20 px-4 pt-3 pb-6 space-y-2 w-full max-w-full overflow-hidden shadow-25d">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-ivory hover:text-caramel-400 hover:bg-espresso-800/50 font-medium text-sm transition-colors"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-ivory hover:text-caramel-400 hover:bg-espresso-800/50 font-medium text-sm transition-colors"
          >
            Menu
          </Link>
          <Link
            to="/story"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-ivory hover:text-caramel-400 hover:bg-espresso-800/50 font-medium text-sm transition-colors"
          >
            Our Story
          </Link>
          <Link
            to="/reservations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-ivory hover:text-caramel-400 hover:bg-espresso-800/50 font-medium text-sm transition-colors"
          >
            Reservations
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-ivory hover:text-caramel-400 hover:bg-espresso-800/50 font-medium text-sm transition-colors"
          >
            Contact
          </Link>

          {user ? (
            <div className="pt-3 border-t border-espresso-800/80 space-y-2">
              <div className="px-3 py-1">
                <p className="text-sm font-semibold text-ivory">{user.name}</p>
                <p className="text-xs text-caramel-400/90 truncate">{user.email}</p>
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-caramel-400 hover:bg-espresso-800/60 font-semibold text-sm transition-colors"
                >
                  <Shield className="w-4 h-4" /> Admin Portal
                </Link>
              )}
              <Link
                to="/my-reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-ivory/90 hover:bg-espresso-800/60 font-medium text-sm transition-colors"
              >
                <Calendar className="w-4 h-4" /> My Bookings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-espresso-800/60 font-medium text-sm text-left transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-espresso-800/80 flex gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('login');
                }}
                className="flex-1 py-2.5 text-center text-xs font-semibold border border-caramel-500/40 rounded-xl text-ivory hover:bg-espresso-800/60 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('register');
                }}
                className="flex-1 py-2.5 text-center text-xs font-bold bg-caramel-500 text-espresso-950 rounded-xl hover:bg-caramel-400 transition-all shadow"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
