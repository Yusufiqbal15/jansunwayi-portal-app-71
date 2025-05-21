import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isLoggedIn: boolean;
  currentLang: 'en' | 'hi';
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, currentLang, toggleLanguage }) => {
  const [notifications, setNotifications] = useState(3);
  
  const translations = {
    en: {
      title: "Ayodhya Court Case Portal",
      home: "Home",
      reports: "Reports",
      logout: "Logout",
      login: "Login"
    },
    hi: {
      title: "डीएम जनसुनवाई पोर्टल",
      home: "होम",
      reports: "रिपोर्ट्स",
      logout: "लॉगआउट",
      login: "लॉगिन"
    }
  };
  
  const t = translations[currentLang];
  
  return (
    <header className="bg-jansunwayi-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Seal_of_Uttar_Pradesh.svg/640px-Seal_of_Uttar_Pradesh.svg.png" 
              alt="Uttar Pradesh logo" 
              className="h-20 w-auto" 
            />
            <h1 className="text-xl md:text-2xl font-bold">{t.title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-white hover:bg-jansunwayi-navy">
                  <Bell />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-jansunwayi-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>
            )}
            
            <div className="language-toggle border rounded-md overflow-hidden">
              <button 
                className={`px-2 py-1 ${currentLang === 'en' ? 'bg-white text-jansunwayi-blue' : 'bg-transparent text-white'}`}
                onClick={currentLang === 'hi' ? toggleLanguage : undefined}
              >
                English
              </button>
              <button 
                className={`px-2 py-1 ${currentLang === 'hi' ? 'bg-white text-jansunwayi-blue' : 'bg-transparent text-white'}`}
                onClick={currentLang === 'en' ? toggleLanguage : undefined}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
        
        {isLoggedIn && (
          <nav className="mt-2">
            <ul className="flex space-x-4">
              <li>
                <Link to="/dashboard" className="hover:text-jansunwayi-gray transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-jansunwayi-gray transition-colors">
                  {t.reports}
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-jansunwayi-gray transition-colors">
                  {t.logout}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
