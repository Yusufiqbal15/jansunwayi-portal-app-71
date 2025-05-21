
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import SubDepartments from '@/components/department/SubDepartments';
import CaseSummary from '@/components/department/CaseSummary';
import CasesTable from '@/components/department/CasesTable';
import { 
  generateMockCases, 
  departments, 
  subDepartments, 
  translations,
  CaseType
} from '@/utils/departmentUtils';

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLang } = useApp();
  const [cases, setCases] = useState<CaseType[]>([]);
  const [showSubDepartments, setShowSubDepartments] = useState<boolean>(false);
  
  const department = departments.find(dept => dept.id === Number(id));
  
  useEffect(() => {
    if (id) {
      setCases(generateMockCases(Number(id)));
      setShowSubDepartments(Number(id) === 1);
    }
  }, [id]);
  
  const totalCases = cases.length;
  const resolvedCases = cases.filter(c => c.status === 'Resolved').length;
  const pendingCases = totalCases - resolvedCases;
  
  const t = translations[currentLang];
  const departmentName = currentLang === 'hi' ? department?.name_hi : department?.name_en;
  
  return (
    <div>
      <DepartmentHeader 
        title={departmentName || ''} 
        t={t} 
      />
      
      {showSubDepartments && (
        <SubDepartments 
          subDepartments={subDepartments} 
          currentLang={currentLang} 
          t={t} 
        />
      )}
      
      <CaseSummary 
        totalCases={totalCases}
        resolvedCases={resolvedCases}
        pendingCases={pendingCases}
        t={t}
      />
      
      <CasesTable 
        cases={cases}
        currentLang={currentLang}
        t={t}
      />
    </div>
  );
};

export default DepartmentPage;
