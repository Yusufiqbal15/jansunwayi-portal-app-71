import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { generateMockCases, translations, isWithinDays } from '@/utils/departmentUtils';
import { subDepartments } from '@/utils/departmentUtils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const SubDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLang } = useApp();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  
  const subDepartment = subDepartments.find(subDept => subDept.id === Number(id));
  const cases = generateMockCases(Number(id));
  
  const t = translations[currentLang];

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendReminderClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setShowEmailDialog(true);
  };

  const handleSendEmail = async () => {
    if (!validateEmail(reminderEmail)) {
      toast.error(currentLang === 'hi' ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    setSending(true);
    // Mock sending email (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    setShowEmailDialog(false);
    toast.success(
      currentLang === 'en'
        ? `Reminder sent for case ${selectedCaseId} to ${reminderEmail}`
        : `मामला ${selectedCaseId} के लिए अनुस्मारक ${reminderEmail} पर भेजा गया`
    );
    setReminderEmail('');
    setSelectedCaseId(null);
  };

  if (!subDepartment) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-jansunwayi-darkgray">Sub-department not found</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jansunwayi-navy">
          {currentLang === 'hi' ? subDepartment.name_hi : subDepartment.name_en}
        </h1>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-jansunwayi-blue text-white">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.totalCases}</h3>
            <p className="text-3xl font-bold">{cases.length}</p>
          </div>
        </Card>
        
        <Card className="bg-jansunwayi-green text-white">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.resolvedCases}</h3>
            <p className="text-3xl font-bold">
              {cases.filter(c => c.status === 'Resolved').length}
            </p>
          </div>
        </Card>
        
        <Card className="bg-jansunwayi-saffron text-white">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t.pendingCases}</h3>
            <p className="text-3xl font-bold">
              {cases.filter(c => c.status === 'Pending').length}
            </p>
          </div>
        </Card>
      </div>
      
      {/* Cases Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-jansunwayi-navy">
            {t.recentCases}
          </h2>
          <Link to="/add-case">
            <Button className="btn-primary">
              {t.addNewCase}
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.caseId}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.date}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.hearingDate}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cases.map((caseItem) => {
                // Show reminder button for all pending cases
                const needsReminder = caseItem.status === 'Pending';
                
                return (
                  <tr key={caseItem.id} className={needsReminder ? 'bg-red-50' : ''}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{caseItem.id}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(caseItem.date, 'yyyy-MM-dd')}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        caseItem.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {currentLang === 'en' ? caseItem.status : (caseItem.status === 'Pending' ? t.pending : t.resolved)}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.hearingDate ? format(caseItem.hearingDate, 'yyyy-MM-dd') : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/case/${caseItem.id}`}>
                          <Button variant="outline" size="sm">
                            {t.viewDetails}
                          </Button>
                        </Link>
                        
                        {needsReminder && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleSendReminderClick(caseItem.id)}
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
      {/* Email Dialog for Reminder */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentLang === 'hi' ? 'ईमेल पता दर्ज करें' : 'Enter Email Address'}</DialogTitle>
            <DialogDescription>
              {currentLang === 'hi'
                ? 'कृपया वह ईमेल पता दर्ज करें जिस पर आप रिमाइंडर भेजना चाहते हैं।'
                : 'Please enter the email address where you want to send the reminder.'}
            </DialogDescription>
          </DialogHeader>
          <Input
            type="email"
            placeholder={currentLang === 'hi' ? 'ईमेल पता' : 'Email address'}
            value={reminderEmail}
            onChange={e => setReminderEmail(e.target.value)}
            disabled={sending}
          />
          <DialogFooter>
            <Button onClick={handleSendEmail} disabled={sending || !reminderEmail}>
              {sending ? (currentLang === 'hi' ? 'भेजा जा रहा है...' : 'Sending...') : (currentLang === 'hi' ? 'भेजें' : 'Send')}
            </Button>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)} disabled={sending}>
              {currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubDepartmentPage; 