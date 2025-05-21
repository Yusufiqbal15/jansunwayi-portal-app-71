import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Edit, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data for demonstration
const getMockCase = (id: string) => {
  const today = new Date();
  const hearingDate = new Date(today);
  hearingDate.setDate(today.getDate() + 5); // Within 7 days
  
  const filingDate = new Date(today);
  filingDate.setDate(today.getDate() - 30);
  
  const affidavitDueDate = new Date(today);
  affidavitDueDate.setDate(today.getDate() + 15);
  
  return {
    id,
    caseNumber: '00125',
    name: 'Sample Case',
    filingDate,
    petitionNumber: 'WP/12345/2025',
    noticeNumber: 'NT/789/2025',
    writType: 'writ',
    department: '1',
    status: 'Pending',
    hearingDate,
    reminderSent: false,
    affidavitDueDate,
    affidavitSubmissionDate: null,
  };
};

const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLang } = useApp();
  
  const [caseData, setCaseData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch this from the backend
    if (id) {
      const mockCase = getMockCase(id);
      setCaseData(mockCase);
      setEditedData(mockCase);
    }
  }, [id]);
  
  const writTypes = [
    { value: 'writ', name_en: 'Writ', name_hi: 'रिट' },
    { value: 'pil', name_en: 'PIL', name_hi: 'पीआईएल' },
    { value: 'criminal', name_en: 'Criminal', name_hi: 'आपराधिक' },
    { value: 'civil', name_en: 'Civil', name_hi: 'नागरिक' }
  ];
  
  const departments = [
    { id: '1', name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
    { id: '2', name_en: "Finance Department", name_hi: "वित्त विभाग" },
    { id: '3', name_en: "Law Department", name_hi: "क़ानून विभाग" },
    { id: '4', name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
    { id: '5', name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
    { id: '6', name_en: "SDM Sadar", name_hi: "SDM सदर" },
  ];
  
  const translations = {
    en: {
      title: "Case Details",
      caseNumber: "Case Number",
      name: "Name",
      filingDate: "Filing Date",
      petitionNumber: "Petition Number",
      noticeNumber: "Notice Number",
      writType: "Writ Type",
      department: "Department",
      status: "Status",
      hearingDate: "Hearing Date",
      reminderSent: "Reminder Sent 1 Week Prior",
      affidavitDueDate: "Due Date to Submit Affidavit",
      affidavitSubmissionDate: "Affidavit Submission Date",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      cancel: "Cancel",
      pending: "Pending",
      resolved: "Resolved",
      yes: "Yes",
      no: "No",
      selectDate: "Select date",
      deleteTitle: "Delete Case",
      deleteDescription: "Are you sure you want to delete this case? This action cannot be undone.",
      deleteConfirm: "Yes, delete case",
      deleteCancel: "Cancel",
      sendReminder: "Send Reminder",
      hearingPending: "Hearing Pending",
      upcomingHearing: "Upcoming Hearing",
      saved: "Changes saved successfully",
      deleted: "Case deleted successfully",
      reminderSentSuccess: "Reminder sent successfully"
    },
    hi: {
      title: "मामले का विवरण",
      caseNumber: "क्रमांक संख्या",
      name: "नाम",
      filingDate: "डायरा दिनांक",
      petitionNumber: "रीट संख्या",
      noticeNumber: "नोटिस संख्या",
      writType: "रीट प्रकार",
      department: "विभाग",
      status: "मामले की स्थिति",
      hearingDate: "सुनवाई दिनांक",
      reminderSent: "एक सप्ताह पूर्व स्मारक भेजा गया?",
      affidavitDueDate: "प्रतिसपथ पत्र दाखिल करने हेतु निर्धारित तिथि",
      affidavitSubmissionDate: "प्रतिसपथ पत्र दाखिल होने की तिथि",
      edit: "संपादित करें",
      delete: "हटाएं",
      save: "सहेजें परिवर्तन",
      cancel: "रद्द करें",
      pending: "लंबित",
      resolved: "निराकृत",
      yes: "हां",
      no: "नहीं",
      selectDate: "तिथि चुनें",
      deleteTitle: "मामला हटाएं",
      deleteDescription: "क्या आप वाकई इस मामले को हटाना चाहते हैं? इस क्रिया को पूर्ववत नहीं किया जा सकता है।",
      deleteConfirm: "हां, मामला हटाएं",
      deleteCancel: "रद्द करें",
      sendReminder: "भेजें अनुस्मारक",
      hearingPending: "सुनवाई लंबित",
      upcomingHearing: "आगामी सुनवाई",
      saved: "परिवर्तन सफलतापूर्वक सहेजे गए",
      deleted: "मामला सफलतापूर्वक हटा दिया गया है",
      reminderSentSuccess: "अनुस्मारक सफलतापूर्वक भेजा गया"
    }
  };
  
  const t = translations[currentLang];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusToggle = () => {
    setEditedData((prev: any) => ({
      ...prev,
      status: prev.status === 'Pending' ? 'Resolved' : 'Pending'
    }));
  };
  
  const handleReminderToggle = () => {
    setEditedData((prev: any) => ({
      ...prev,
      reminderSent: !prev.reminderSent
    }));
  };
  
  const handleSave = () => {
    // In a real app, you would save this to the backend
    setCaseData(editedData);
    setIsEditing(false);
    toast.success(t.saved);
  };
  
  const handleDelete = () => {
    // In a real app, you would delete this from the backend
    toast.success(t.deleted);
    navigate('/dashboard');
  };
  
  const sendReminder = () => {
    setCaseData((prev: any) => ({
      ...prev,
      reminderSent: true
    }));
    setEditedData((prev: any) => ({
      ...prev,
      reminderSent: true
    }));
    toast.success(t.reminderSentSuccess);
  };
  
  const isWithin7Days = (date: Date) => {
    if (!date) return false;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };
  
  const needsReminder = caseData?.status === 'Pending' && 
                        caseData?.hearingDate && 
                        isWithin7Days(caseData.hearingDate) &&
                        !caseData?.reminderSent;
  
  if (!caseData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jansunwayi-blue"></div>
      </div>
    );
  }
  
  const getDepartmentName = (id: string) => {
    const dept = departments.find(d => d.id === id);
    return dept ? (currentLang === 'hi' ? dept.name_hi : dept.name_en) : '';
  };
  
  const getWritTypeName = (value: string) => {
    const type = writTypes.find(t => t.value === value);
    return type ? (currentLang === 'hi' ? type.name_hi : type.name_en) : '';
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-jansunwayi-navy mb-6">{t.title}</h1>
      
      {/* Reminder Banner */}
      {needsReminder && (
        <div className="mb-6 reminder-card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-jansunwayi-red">
                ⚠️ {t.hearingPending}
              </h3>
              <p>
                {t.upcomingHearing}: {format(caseData.hearingDate, 'yyyy-MM-dd')}
              </p>
            </div>
            <Button
              onClick={sendReminder}
              variant="destructive"
            >
              {t.sendReminder}
            </Button>
          </div>
        </div>
      )}
      
      <Card className="p-6">
        <div className="flex justify-end space-x-2 mb-6">
          {!isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t.edit}
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.delete}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                variant="default"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                {t.save}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(caseData);
                }}
                variant="outline"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                {t.cancel}
              </Button>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Case Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.caseNumber}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="caseNumber"
                value={editedData.caseNumber}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.caseNumber}
              </div>
            )}
          </div>
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.name}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.name}
              </div>
            )}
          </div>
          
          {/* Filing Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.filingDate}
            </label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedData.filingDate ? (
                      format(editedData.filingDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedData.filingDate}
                    onSelect={(date) => setEditedData((prev: any) => ({ ...prev, filingDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {format(caseData.filingDate, 'yyyy-MM-dd')}
              </div>
            )}
          </div>
          
          {/* Petition Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.petitionNumber}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="petitionNumber"
                value={editedData.petitionNumber}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.petitionNumber}
              </div>
            )}
          </div>
          
          {/* Notice Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.noticeNumber}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="noticeNumber"
                value={editedData.noticeNumber}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.noticeNumber}
              </div>
            )}
          </div>
          
          {/* Writ Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.writType}
            </label>
            {isEditing ? (
              <select
                name="writType"
                value={editedData.writType}
                onChange={handleChange}
                className="input-field"
              >
                {writTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {currentLang === 'hi' ? type.name_hi : type.name_en}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {getWritTypeName(caseData.writType)}
              </div>
            )}
          </div>
          
          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.department}
            </label>
            {isEditing ? (
              <select
                name="department"
                value={editedData.department}
                onChange={handleChange}
                className="input-field"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {currentLang === 'hi' ? dept.name_hi : dept.name_en}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {getDepartmentName(caseData.department)}
              </div>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.status}
            </label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant={editedData.status === 'Pending' ? 'default' : 'outline'}
                  onClick={handleStatusToggle}
                >
                  {t.pending}
                </Button>
                <Button
                  type="button"
                  variant={editedData.status === 'Resolved' ? 'default' : 'outline'}
                  onClick={handleStatusToggle}
                >
                  {t.resolved}
                </Button>
              </div>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.status === 'Pending' ? t.pending : t.resolved}
              </div>
            )}
          </div>
          
          {/* Hearing Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.hearingDate}
            </label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedData.hearingDate ? (
                      format(editedData.hearingDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedData.hearingDate}
                    onSelect={(date) => setEditedData((prev: any) => ({ ...prev, hearingDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.hearingDate ? format(caseData.hearingDate, 'yyyy-MM-dd') : '-'}
              </div>
            )}
          </div>
          
          {/* Reminder Sent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.reminderSent}
            </label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant={editedData.reminderSent ? 'default' : 'outline'}
                  onClick={handleReminderToggle}
                >
                  {t.yes}
                </Button>
                <Button
                  type="button"
                  variant={!editedData.reminderSent ? 'default' : 'outline'}
                  onClick={handleReminderToggle}
                >
                  {t.no}
                </Button>
              </div>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.reminderSent ? t.yes : t.no}
              </div>
            )}
          </div>
          
          {/* Affidavit Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.affidavitDueDate}
            </label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedData.affidavitDueDate ? (
                      format(editedData.affidavitDueDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedData.affidavitDueDate}
                    onSelect={(date) => setEditedData((prev: any) => ({ ...prev, affidavitDueDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.affidavitDueDate ? format(caseData.affidavitDueDate, 'yyyy-MM-dd') : '-'}
              </div>
            )}
          </div>
          
          {/* Affidavit Submission Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.affidavitSubmissionDate}
            </label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedData.affidavitSubmissionDate ? (
                      format(editedData.affidavitSubmissionDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedData.affidavitSubmissionDate}
                    onSelect={(date) => setEditedData((prev: any) => ({ ...prev, affidavitSubmissionDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                {caseData.affidavitSubmissionDate ? format(caseData.affidavitSubmissionDate, 'yyyy-MM-dd') : '-'}
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.deleteCancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-jansunwayi-red hover:bg-red-600">
              {t.deleteConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CaseDetailPage;
