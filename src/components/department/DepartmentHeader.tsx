
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TranslationType } from '@/utils/departmentUtils';

interface DepartmentHeaderProps {
  title: string;
  t: TranslationType;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({ title, t }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-jansunwayi-navy">
        {t.title} - {title}
      </h1>
      <Link to="/add-case">
        <Button className="btn-primary">
          {t.addNewCase}
        </Button>
      </Link>
    </div>
  );
};

export default DepartmentHeader;
