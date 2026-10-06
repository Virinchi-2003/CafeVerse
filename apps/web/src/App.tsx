import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ReservationPage } from './pages/ReservationPage';
import { StoryPage } from './pages/StoryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerPortal } from './pages/CustomerPortal';

export const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const toggleTheme = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    if (nextMode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeMode === 'dark' ? 'bg-espresso-950 text-ivory' : 'bg-ivory text-espresso-950'}`}>
          <Navbar
            themeMode={themeMode}
            onToggleTheme={toggleTheme}
            onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
          />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/my-reservations" element={<CustomerPortal />} />
            </Routes>
          </main>

          <Footer />

          {authModal.isOpen && (
            <AuthModal
              initialMode={authModal.mode}
              onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
            />
          )}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
