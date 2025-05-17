
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, isWithinDays } from 'date-fns';
import { toast } from 'sonner';

// Mock data
const generateMockCases = (departmentId: number) => {
  const statuses = ['Pending', 'Resolved'];
  const today = new Date();
  
  return Array(15).fill(null).map((_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const caseDate = new Date(today);
    caseDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    const hearingDate = new Date(today);
    hearingDate.setDate(today.getDate() + Math.floor(Math.random() * 14));
    
    return {
      id: `CASE-${departmentId}-${100 + index}`,
      date: caseDate,
      status,
      hearingDate: status === 'Pending' ? hearingDate : null,
      name: `Sample Case ${index + 1}`,
    };
  });
};

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLang } = useApp();
  const [cases, setCases] = useState<any[]>([]);
  
  const departments = [
    { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
    { id: 2, name_en: "Finance Department", name_hi: "वित्त विभाग" },
    { id: 3, name_en: "Law Department", name_hi: "क़ानून विभाग" },
    { id: 4, name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
    { id: 5, name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
    { id: 6, name_en: "SDM Sadar", name_hi: "SDM सदर" },
  ];
  
  const department = departments.find(dept => dept.id === Number(id));
  
  useEffect(() => {
    if (id) {
      setCases(generateMockCases(Number(id)));
    }
  }, [id]);
  
  const totalCases = cases.length;
  const resolvedCases = cases.filter(c => c.status === 'Resolved').length;
  const pendingCases = totalCases - resolvedCases;
  
  const sendReminder = (caseId: string) => {
    toast.success(
      currentLang === 'en' 
        ? `Reminder sent for case ${caseId}` 
        : `मामला ${caseId} के लिए अनुस्मारक भेजा गया`
    );
  };
  
  const translations = {
    en: {
      title: "Department Report",
      totalCases: "Total Cases",
      resolvedCases: "Resolved Cases",
      pendingCases: "Pending Cases",
      caseId: "Case ID",
      date: "Date",
      status: "Status",
      hearingDate: "Hearing Date",
      actions: "Actions",
      sendReminder: "Send Reminder",
      pending: "Pending",
      resolved: "Resolved",
      viewDetails: "View Details",
      addNewCase: "Add New Case"
    },
    hi: {
      title: "विभागीय रिपोर्ट",
      totalCases: "कुल मामले",
      resolvedCases: "निराकृत मामले",
      pendingCases: "लंबित मामले",
      caseId: "मामला आईडी",
      date: "दिनांक",
      status: "स्थिति",
      hearingDate: "सुनवाई दिनांक",
      actions: "कार्यवाही",
      sendReminder: "भेजें अनुस्मारक",
      pending: "लंबित",
      resolved: "निराकृत",
      viewDetails: "विवरण देखें",
      addNewCase: "नया मामला जोड़ें"
    }
  };
  
  const t = translations[currentLang];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-jansunwayi-navy">
          {t.title} - {currentLang === 'hi' ? department?.name_hi : department?.name_en}
        </h1>
        <Link to="/add-case">
          <Button className="btn-primary">
            {t.addNewCase}
          </Button>
        </Link>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-jansunwayi-blue text-white">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.totalCases}</h3>
            <p className="text-3xl font-bold">{totalCases}</p>
          </div>
        </Card>
        
        <Card className="bg-jansunwayi-green text-white">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.resolvedCases}</h3>
            <p className="text-3xl font-bold">{resolvedCases}</p>
          </div>
        </Card>
        
        <Card className="bg-jansunwayi-saffron text-white">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.pendingCases}</h3>
            <p className="text-3xl font-bold">{pendingCases}</p>
          </div>
        </Card>
      </div>
      
      {/* Cases list */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.caseId}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.date}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.hearingDate}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((c) => {
                const needsReminder = c.status === 'Pending' && c.hearingDate && isWithinDays(c.hearingDate, new Date(), 7);
                
                return (
                  <tr key={c.id} className={needsReminder ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{c.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(c.date, 'yyyy-MM-dd')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        c.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {currentLang === 'en' ? c.status : (c.status === 'Pending' ? t.pending : t.resolved)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.hearingDate ? format(c.hearingDate, 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/case/${c.id}`}>
                          <Button variant="outline" size="sm">
                            {t.viewDetails}
                          </Button>
                        </Link>
                        
                        {needsReminder && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => sendReminder(c.id)}
                          >
                            {t.sendReminder}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DepartmentPage;
