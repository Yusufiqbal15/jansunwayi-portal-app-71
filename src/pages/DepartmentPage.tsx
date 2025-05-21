
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import DepartmentHeader from '@/components/department/DepartmentHeader';
import SubDepartments from '@/components/department/SubDepartments';
import { 
  departments, 
  subDepartments, 
  translations
} from '@/utils/departmentUtils';

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLang } = useApp();
  const [showSubDepartments, setShowSubDepartments] = useState<boolean>(false);
  
  const department = departments.find(dept => dept.id === Number(id));
  
  useEffect(() => {
    if (id) {
      // Only show sub-departments for department ID 1 (for the example)
      setShowSubDepartments(Number(id) === 1);
    }
  }, [id]);
  
  // Filter sub-departments for this department
  const departmentSubDepts = subDepartments.filter(subDept => 
    // For the example, we'll associate all sub-departments with department ID 1
    Number(id) === 1
  );
  
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
          subDepartments={departmentSubDepts} 
          currentLang={currentLang} 
          t={t} 
        />
      )}
    </div>
  );
};

export default DepartmentPage;
