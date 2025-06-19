import React from 'react';
import { useApp } from '@/contexts/AppContext';
import DashboardChart from '@/components/department/DashboardChart';

const HomePage: React.FC = () => {
  const { currentLang } = useApp();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {currentLang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
      </h1>
      <DashboardChart currentLang={currentLang} />
    </div>
  );
};

export default HomePage; 