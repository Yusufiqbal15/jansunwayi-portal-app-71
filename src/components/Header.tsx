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
      login: "Login",
      Print: "Print"
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
    <header className=" top-0 left-0 w-full z-50 bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo and Title with Navigation */}
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.jpg"
              alt="Uttar Pradesh logo" 
             style={{ borderRadius: '40px ' }}
              className="h-20 w-auto" 
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{t.title}</h1>
              {isLoggedIn && (
                <nav className="mt-1">
                  <ul className="flex space-x-4 text-sm md:text-base">
                    <li>
                      <Link to="/dashboard" className="hover:text-jansunwayi-gray bx1 transition-colors">
                        {t.home}
                      </Link>
                    </li>
                    <li className="relative group">
                      <button
                        className="hover:text-jansunwayi-gray transition-colors focus:outline-none"
                      >
                        {t.reports}
                      </button>
                      <ul className="absolute left-0 mt-2 w-48 bg-white text-jansunwayi-blue rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-10">
                        <li>
                          <Link
                            to="/reports"
                            className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            Department Report
                          </Link>
                        </li>
                        
                      </ul>
                    </li>
                    <li>
                      <Link to="/" className="hover:text-jansunwayi-gray  transition-colors">
                        {t.logout}
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="hover:text-jansunwayi-gray transition-colors focus:outline-none"
                        onClick={() => {
                          // Create a blank PDF and trigger download
                          const doc = new window.Blob([' '], { type: 'application/pdf' });
                          const url = window.URL.createObjectURL(doc);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'blank.pdf';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        }}
                      >
                        
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>

          {/* Notification & Language Toggle */}
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

            {/* Language Toggle */}
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
      </div>
    </header>
  );
};

export default Header;
