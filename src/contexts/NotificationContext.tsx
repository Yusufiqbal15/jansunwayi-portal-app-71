import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCases } from '@/lib/api';
import { format, addDays, isBefore } from 'date-fns';
import { useApp } from './AppContext';

interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: 'hearing' | 'reminder' | 'info';
  date: Date;
  caseId: string;
  departmentName: string;
  subDepartmentName: string;
}

interface NotificationContextType {
  notifications: NotificationType[];
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { currentLang } = useApp();

  // Fetch all cases
  const { data: casesData } = useQuery({
    queryKey: ['cases'],
    queryFn: fetchCases,
  });

  useEffect(() => {
    if (casesData?.cases) {
      const upcomingHearings = casesData.cases
        .filter((caseItem: any) => {
          if (!caseItem.hearingDate || caseItem.status !== 'Pending') return false;
          
          const hearingDate = new Date(caseItem.hearingDate);
          const tenDaysBefore = addDays(new Date(), 10);
          
          return isBefore(new Date(), hearingDate) && isBefore(hearingDate, tenDaysBefore);
        })
        .map((caseItem: any) => ({
          id: `${caseItem._id}-hearing`,
          title: currentLang === 'hi' ? 'आगामी सुनवाई' : 'Upcoming Hearing',
          message: currentLang === 'hi'
            ? `मामला संख्या ${caseItem.caseNumber} की सुनवाई ${format(new Date(caseItem.hearingDate), 'dd/MM/yyyy')} को है`
            : `Case ${caseItem.caseNumber} has hearing scheduled on ${format(new Date(caseItem.hearingDate), 'dd/MM/yyyy')}`,
          type: 'hearing',
          date: new Date(caseItem.hearingDate),
          caseId: caseItem._id,
          departmentName: caseItem.department?.name || '',
          subDepartmentName: caseItem.subDepartment?.name || ''
        }));

      setNotifications(upcomingHearings);
    }
  }, [casesData, currentLang]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}; 