
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useApp } from '@/contexts/AppContext';

interface LayoutProps {
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = false }) => {
  const { user, currentLang, toggleLanguage } = useApp();
  const isLoggedIn = !!user;

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isLoggedIn={isLoggedIn}
        currentLang={currentLang}
        toggleLanguage={toggleLanguage}
      />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer currentLang={currentLang} />
    </div>
  );
};

export default Layout;
