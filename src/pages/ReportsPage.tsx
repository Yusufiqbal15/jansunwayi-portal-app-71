import React from 'react';
import { useApp } from '@/contexts/AppContext';
import DashboardChart from '@/components/department/DashboardChart';

const ReportsPage: React.FC = () => {
  const { currentLang } = useApp();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {currentLang === 'hi' ? 'रिपोर्ट' : 'Reports'}
      </h1>
      <DashboardChart currentLang={currentLang} />
    </div>
  );
};

export default ReportsPage; 