
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import SubDepartments from '@/components/department/SubDepartments';
import CaseSummary from '@/components/department/CaseSummary';
import CasesTable from '@/components/department/CasesTable';
import { 
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
      // We're no longer generating cases here as they are now generated per sub-department
      setShowSubDepartments(Number(id) === 1);
    }
  }, [id]);
  
  // Calculate total cases across all sub-departments for this department
  const departmentSubDepts = subDepartments.filter(subDept => 
    // For the example, we'll associate all sub-departments with department ID 1
    Number(id) === 1
  );
  
  let allCases: CaseType[] = [];
  departmentSubDepts.forEach((subDept, subDeptIndex) => {
    // Generate unique cases for each sub-department
    const subDeptCases = Array(5).fill(null).map((_, caseIndex) => ({ 
      id: `CASE-${subDept.id}-${caseIndex}`, // Ensure unique IDs
      date: new Date(),
      status: Math.random() > 0.5 ? 'Resolved' as const : 'Pending' as const,
      hearingDate: new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 14),
      name: `Case for ${currentLang === 'en' ? subDept.name_en : subDept.name_hi}`
    }));
    allCases = [...allCases, ...subDeptCases];
  });
  
  useEffect(() => {
    setCases(allCases);
  }, [id, currentLang]);
  
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
