
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';

const DashboardPage: React.FC = () => {
  const { currentLang } = useApp();
  
  const departments = [
    { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
    { id: 2, name_en: "Finance Department", name_hi: "वित्त विभाग" },
    { id: 3, name_en: "Law Department", name_hi: "क़ानून विभाग" },
    { id: 4, name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
    { id: 5, name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
    { id: 6, name_en: "SDM Sadar", name_hi: "SDM सदर" },
  ];
  
  const translations = {
    en: {
      title: "Department List",
      subtitle: "Select a department to view its reports"
    },
    hi: {
      title: "विभाग सूची",
      subtitle: "रिपोर्ट देखने के लिए एक विभाग चुनें"
    }
  };
  
  const t = translations[currentLang];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jansunwayi-navy">{t.title}</h1>
        <p className="text-jansunwayi-darkgray">{t.subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Link to={`/department/${dept.id}`} key={dept.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {currentLang === 'hi' ? dept.name_hi : dept.name_en}
                </h2>
                <div className="h-1 w-16 bg-jansunwayi-saffron rounded-full mb-4"></div>
                <p className="text-jansunwayi-darkgray">
                  {currentLang === 'en' ? 'View Reports' : 'रिपोर्ट देखें'}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
