
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CaseType, TranslationType, isWithinDays } from '@/utils/departmentUtils';
import { toast } from 'sonner';

interface CasesTableProps {
  cases: CaseType[];
  currentLang: 'en' | 'hi';
  t: TranslationType;
}

const CasesTable: React.FC<CasesTableProps> = ({ cases, currentLang, t }) => {
  const sendReminder = (caseId: string) => {
    toast.success(
      currentLang === 'en' 
        ? `Reminder sent for case ${caseId}` 
        : `मामला ${caseId} के लिए अनुस्मारक भेजा गया`
    );
  };

  return (
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
              const needsReminder = c.status === 'Pending' && c.hearingDate && isWithinDays(c.hearingDate, 7);
              
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
  );
};

export default CasesTable;
