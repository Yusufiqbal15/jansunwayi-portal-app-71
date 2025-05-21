
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
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
  // Track which sub-departments are open
  const [openSubDepts, setOpenSubDepts] = useState<Record<number, boolean>>({});

  const toggleSubDept = (id: number) => {
    setOpenSubDepts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
          const isOpen = openSubDepts[subDept.id] || false;
          
          return (
            <Collapsible
              key={subDept.id}
              open={isOpen}
              onOpenChange={() => toggleSubDept(subDept.id)}
              className="w-full"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
                    <h3 className="text-lg font-medium">
                      {currentLang === 'hi' ? subDept.name_hi : subDept.name_en}
                    </h3>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                  
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
                  
                  <CollapsibleContent>
                    <div className="pt-3 border-t mt-3">
                      <h4 className="font-medium mb-2">{t.recentCases}</h4>
                      <ul className="space-y-2">
                        {subDeptCases.slice(0, 3).map((caseItem) => (
                          <li key={caseItem.id} className="text-sm">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 
                              ${caseItem.status === 'Resolved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'}`}>
                              {caseItem.status === 'Resolved' ? t.resolved : t.pending}
                            </span>
                            {caseItem.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                  
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the collapsible
                        // View sub-department action
                      }}
                    >
                      {t.viewSubDepartment}
                    </Button>
                  </div>
                </div>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </>
  );
};

export default SubDepartments;
