
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TranslationType, 
  CaseType,
  generateMockCases 
} from '@/utils/departmentUtils';

interface SubDepartment {
  id: number;
  name_en: string;
  name_hi: string;
}

interface SubDepartmentsProps {
  subDepartments: SubDepartment[];
  currentLang: 'en' | 'hi';
  t: TranslationType;
}

const SubDepartments: React.FC<SubDepartmentsProps> = ({ subDepartments, currentLang, t }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-jansunwayi-navy">
          {t.subDepartments}
        </h2>
        <Link to="/add-case">
          <Button className="btn-primary">
            {t.addNewCase}
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subDepartments.map((subDept) => {
          // Generate mock cases for each sub-department
          const subDeptCases = generateMockCases(subDept.id);
          const totalCases = subDeptCases.length;
          const resolvedCases = subDeptCases.filter(c => c.status === 'Resolved').length;
          
          return (
            <Card key={subDept.id} className="hover:shadow-lg transition-shadow">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">
                  {currentLang === 'hi' ? subDept.name_hi : subDept.name_en}
                </h3>
                <div className="mt-2 mb-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t.totalCases}:</span> {totalCases}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t.resolvedCases}:</span> {resolvedCases}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t.pendingCases}:</span> {totalCases - resolvedCases}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    {t.viewSubDepartment}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default SubDepartments;
