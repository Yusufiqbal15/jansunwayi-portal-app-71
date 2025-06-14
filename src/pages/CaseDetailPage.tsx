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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ReportsPage from './pages/ReportsPage';
import { useQueryClient } from '@tanstack/react-query';
import { fetchCases } from '@/lib/api';

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
    counterAffidavitRequired: false,
    reminderSentCount: 0,
  };
};

const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLang } = useApp();
  const queryClient = useQueryClient();
  
  const [caseData, setCaseData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [sending, setSending] = useState(false);
  
  useEffect(() => {
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
    { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
    { id: 2, name_en: "Development department", name_hi: "विकास विभाग" },
    { id: 3, name_en: "District Panchayat Department", name_hi: "जिला पंचायत विभाग" },
    { id: 4, name_en: "District Social Welfare Department", name_hi: "जिला समाज कल्याण विभाग" },
    { id: 5, name_en: "Animal Husbandry Department", name_hi: "पशुपालन विभाग" },
    { id: 6, name_en: "District Industries Department", name_hi: "जिला उद्योग विभाग" },
    { id: 7, name_en: "District Education Department", name_hi: "जिला शिक्षा विभाग" },
    { id: 8, name_en: "District Health Department", name_hi: "जिला स्वास्थ्य विभाग" },
    { id: 9, name_en: "District Agriculture Department", name_hi: "जिला कृषि विभाग" },
    { id: 10, name_en: "District Forest Department", name_hi: "जिला वन विभाग" },
    { id: 11, name_en: "District Program Department", name_hi: "जिला कार्यक्रम विभाग" },
    { id: 12, name_en: "District Food and Marketing Department", name_hi: "जिला खाद्य एवं विपणन विभाग" },
    { id: 13, name_en: "District Food Logistics Department", name_hi: "जिला खाद्य रसद विभाग" },
    { id: 14, name_en: "Agriculture Department", name_hi: "कृषि विभाग" },
    { id: 15, name_en: "Sugarcan Department", name_hi: "गन्ना विभाग" },
    { id: 16, name_en: "Agricultural Production Market Committee", name_hi: "कृषि उत्पादन मंडी समिति" },
    { id: 17, name_en: "labor department", name_hi: "श्रम विभाग" },
    { id: 18, name_en: "Excise Department", name_hi: "आबकारी विभाग" },
    { id: 19, name_en: "irrigation department", name_hi: "सिंचाई विभाग" },
    { id: 20, name_en: "Public Works Department, Provincial Division", name_hi: "लोक निर्माण विभाग, प्रान्तीय खण्ड" },
    { id: 21, name_en: "Public Works Department Construction Division-02", name_hi: "लोक निर्माण विभाग निर्माण खण्ड-02" },
    { id: 22, name_en: "Public Works Department Construction Division-03", name_hi: "लोक निर्माण विभाग निर्माण खण्ड-03" },
    { id: 23, name_en: "Public Works Department Division-04", name_hi: "लोक निर्माण विभाग खण्ड-04" },
    { id: 24, name_en: "Public Works Department NH (National Highway) Division", name_hi: "लोक निर्माण विभाग एन0एच0 खण्ड" },
    { id: 25, name_en: "Rural Engineering Department (R.E.D.)", name_hi: "ग्रामीण अभियंत्रण विभाग (आर०ई०डी०)" },
    { id: 26, name_en: "Saryu Canal Division", name_hi: "सरयू नहर खण्ड" },
    { id: 27, name_en: "Flood Works Division", name_hi: "बाढ़ कार्य खण्ड" },
    { id: 28, name_en: "Groundwater Department", name_hi: "भूगर्भ जल विभाग"},
    { id: 29, name_en: "Lift Irrigation Division", name_hi: "लिफ्ट सिंचाई खण्ड" },
    { id: 30, name_en: "Tubewell Construction Division", name_hi: "नलकूप निर्माण खण्ड" },
    { id: 31, name_en: "U.P. Jal Nigam Urban Construction Division", name_hi: "उ0 प्र0 जल निगम नगरीय निर्माण खण्ड" },
    { id: 32, name_en: "Minor Irrigation Division Ayodhya", name_hi: "लघु सिंचाई खण्ड अयोध्या" },
    { id: 33, name_en: "Electricity Department", name_hi: "विद्युत विभाग" },
    { id: 34, name_en: "ITI Department", name_hi: "आई0टी0आई0 विभाग" },
    { id: 35, name_en: "State Tax Department", name_hi: "राज्य कर विभाग" },
    { id: 36, name_en: "Police Department", name_hi: "पुलिस विभाग" },
    { id: 37, name_en: "Education Department", name_hi: "शिक्षा विभाग" },
    { id: 38, name_en: "Divisional Transport Department", name_hi: "सम्भागीय परिवहन विभाग " },
    { id: 39, name_en: "Uttar Pradesh State Road Transport Department", name_hi: "उ0 प्र0 राज्य सड़क परिवहन विभाग" },
    { id: 40, name_en: "Information Department", name_hi: "सूचना विभाग " },
    { id: 41, name_en: "Home Guards Department", name_hi: "होम गार्ड्स विभाग" },
    { id: 42, name_en: "Health Department", name_hi: "स्वास्थ्य विभाग" },
    { id: 43, name_en: "Stamp and Registration Department", name_hi: "स्टाम्प एवं रजिस्ट्रेशन विभाग" },
    { id: 44, name_en: "Ayodhya Development Authority Ayodhya", name_hi: "अयोध्या विकास प्राधिकरण अयोध्या" },
    { id: 45, name_en: "Public Works Department Electrical & Mechanical Section", name_hi: "लोक निर्माण विभाग विद्युत यांत्रिक खण्ड" },
    { id: 46, name_en: "Cooperative Department", name_hi: "सहकारिता विभाग" },
    { id: 47, name_en: "UPPCL U.P. Project Corporation Ltd. Construction Unit-11 Ayodhya", name_hi: "यूपीपीसीएल उ0 प्र0 प्रोजेक्ट कारपोरेशन लि0 निर्माण इकाई-11 अयोध्या।" },
    { id: 48, name_en: "Other Miscellaneous Departments", name_hi: "अन्य विविध विभाग" },
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
      isthecounteraffidavittobefiledornot: " Is The Counter-Affidavit to be filed or not?",
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
      counterAffidavitinstruction: "Counter Affidavit (instruction)",
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
      isthecounteraffidavittobefiledornot:"प्रतिशपथ पत्र पत्र दाखिल होना है या नहीं ?",
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
      counterAffidavitinstruction: "प्रतिसपथ पत्र (आदेश)",
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
  
  const handleCounterAffidavitToggle = () => {
    setEditedData((prev: any) => ({
      ...prev,
      counterAffidavitRequired: !prev.counterAffidavitRequired
    }));
  };
  
  const handleSave = () => {
    setCaseData(editedData);
    setIsEditing(false);
    toast.success(t.saved);
    queryClient.invalidateQueries({ queryKey: ['cases'] });
  };
  
  const handleDelete = () => {
    toast.success(t.deleted);
    queryClient.invalidateQueries({ queryKey: ['cases'] });
    navigate('/dashboard');
  };
  
  const sendReminder = async () => {
    setShowEmailDialog(true);
  };
  
  const handleSendEmail = async () => {
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSending(false);
    setShowEmailDialog(false);
    setReminderEmail('');
    toast.success(`${t.reminderSentSuccess} (${reminderEmail})`);
    queryClient.invalidateQueries({ queryKey: ['cases'] });
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
                <span className="ml-4 text-xs text-gray-500">
                  {currentLang === 'hi' ? `भेजा गया: ${editedData.reminderSentCount || 0} बार` : `Sent: ${editedData.reminderSentCount || 0} times`}
                </span>
              </div>
            ) : (
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-between">
                <span>{caseData.reminderSent ? t.yes : t.no}</span>
                <span className="ml-4 text-xs text-gray-500">
                  {currentLang === 'hi' ? `भेजा गया: ${caseData.reminderSentCount || 0} बार` : `Sent: ${caseData.reminderSentCount || 0} times`}
                </span>
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
          
          {/* Counter Affidavit Section */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.counterAffidavitinstruction}
            </label>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">
                {t.isthecounteraffidavittobefiledornot}
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleCounterAffidavitToggle}
                  className={`px-4 py-2 rounded-md ${
                    editedData.counterAffidavitRequired
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  onClick={handleCounterAffidavitToggle}
                  className={`px-4 py-2 rounded-md ${
                    !editedData.counterAffidavitRequired
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {t.no}
                </button>
              </div>
            </div>
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

export default CaseDetailPage;
