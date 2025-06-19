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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const DepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLang } = useApp();
  const [showSubDepartments, setShowSubDepartments] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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

  // Filter sub-departments based on search query
  const filteredSubDepts = departmentSubDepts.filter(subDept => {
    const searchLower = searchQuery.toLowerCase();
    return (
      subDept.name_en.toLowerCase().includes(searchLower) ||
      subDept.name_hi.includes(searchQuery)
    );
  });
  
  const t = translations[currentLang];
  const departmentName = currentLang === 'hi' ? department?.name_hi : department?.name_en;
  
  return (
    <div>
      <DepartmentHeader 
        title={departmentName || ''} 
        t={t} 
      />
      
      {showSubDepartments && (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={currentLang === 'hi' ? 'विभाग खोजें...' : 'Search department...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <SubDepartments 
            subDepartments={filteredSubDepts} 
            currentLang={currentLang} 
            t={t} 
          />
        </>
      )}
    </div>
  );
};

export default DepartmentPage;
