
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslationType } from '@/utils/departmentUtils';

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
      <h2 className="text-xl font-semibold mb-4 text-jansunwayi-navy">
        {t.subDepartments}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subDepartments.map((subDept) => (
          <Card key={subDept.id} className="hover:shadow-lg transition-shadow">
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">
                {currentLang === 'hi' ? subDept.name_hi : subDept.name_en}
              </h3>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  {t.viewSubDepartment}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default SubDepartments;
