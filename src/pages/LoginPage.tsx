import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { currentLang } = useApp();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');

  const translations = {
    en: {
      title: "Ayodhya Court Case Portal",
      subtitle: "Login to access the portal",
      emailPlaceholder: "Email / Phone number",
      passwordPlaceholder: "Password",
      loginButton: "Login",
      forgotPassword: "Forgot Password?",
      admin: "Admin",
      user: "User",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      loginSuccess: "Login successful",
      loginError: "Invalid credentials. Please try again."
    },
    hi: {
      title: "डीएम जनसुनवाई पोर्टल",
      subtitle: "पोर्टल का उपयोग करने के लिए लॉगिन करें",
      emailPlaceholder: "ईमेल / फोन नंबर",
      passwordPlaceholder: "पासवर्ड",
      loginButton: "लॉगिन",
      forgotPassword: "पासवर्ड भूल गए?",
      admin: "प्रशासक",
      user: "उपयोगकर्ता",
      emailRequired: "ईमेल आवश्यक है",
      passwordRequired: "पासवर्ड आवश्यक है",
      loginSuccess: "लॉगिन सफल",
      loginError: "अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।"
    }
  };

  const t = translations[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error(t.emailRequired);
      return;
    }
    if (!password) {
      toast.error(t.passwordRequired);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password, role: selectedRole }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem('token', data.token);
      toast.success(t.loginSuccess);
      navigate('/dashboard');
    } catch (error) {
      toast.error(t.loginError);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-jansunwayi-navy">{t.title}</h1>
          <p className="text-jansunwayi-darkgray">{t.subtitle}</p>
        </div>

        <div className="mb-6">
          <div className="flex rounded-md overflow-hidden border">
            <button
              type="button"
              className={`flex-1 py-2 text-center ${
                selectedRole === 'admin'
                  ? 'bg-jansunwayi-blue text-white'
                  : 'bg-white text-jansunwayi-darkgray'
              }`}
              onClick={() => setSelectedRole('admin')}
            >
              {t.admin}
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center ${
                selectedRole === 'user'
                  ? 'bg-jansunwayi-blue text-white'
                  : 'bg-white text-jansunwayi-darkgray'
              }`}
              onClick={() => setSelectedRole('user')}
            >
              {t.user}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={
                  selectedRole === 'admin'
                    ? currentLang === 'hi'
                      ? 'प्रशासक आईडी'
                      : 'Admin ID'
                    : currentLang === 'hi'
                    ? 'यूजर आईडी'
                    : 'User ID'
                }
                className="input-field"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  selectedRole === 'admin'
                    ? t.passwordPlaceholder + ' (Admin)'
                    : t.passwordPlaceholder + ' (User)'
                }
                className="input-field"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" className="btn-primary w-full">
                {t.loginButton}
              </Button>
            </div>

            <div className="text-center mt-4">
              <a href="#" className="text-jansunwayi-blue hover:underline text-sm">
                {t.forgotPassword}
              </a>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
