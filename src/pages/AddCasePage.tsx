
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const AddCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang } = useApp();
  
  const [formData, setFormData] = useState({
    caseNumber: '',
    name: '',
    filingDate: null as Date | null,
    petitionNumber: '',
    noticeNumber: '',
    writType: '',
    department: '',
    affidavitDueDate: null as Date | null,
    affidavitSubmissionDate: null as Date | null,
  });
  
  const departments = [
    { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
    { id: 2, name_en: "Finance Department", name_hi: "वित्त विभाग" },
    { id: 3, name_en: "Law Department", name_hi: "क़ानून विभाग" },
    { id: 4, name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
    { id: 5, name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
    { id: 6, name_en: "SDM Sadar", name_hi: "SDM सदर" },
  ];
  
  const writTypes = [
    { value: 'writ', name_en: 'Writ', name_hi: 'रिट' },
    { value: 'pil', name_en: 'PIL', name_hi: 'पीआईएल' },
    { value: 'criminal', name_en: 'Criminal', name_hi: 'आपराधिक' },
    { value: 'civil', name_en: 'Civil', name_hi: 'नागरिक' }
  ];
  
  const translations = {
    en: {
      title: "Add New Case",
      caseNumber: "Case Number",
      name: "Name",
      filingDate: "Filing Date",
      petitionNumber: "Petition Number",
      noticeNumber: "Notice Number",
      writType: "Writ Type",
      department: "Department",
      affidavitDueDate: "Due Date to Submit Affidavit",
      affidavitSubmissionDate: "Affidavit Submission Date",
      save: "Save Case",
      cancel: "Cancel",
      selectDate: "Select date",
      selectDepartment: "Select department",
      selectWritType: "Select writ type",
      saved: "Case has been saved successfully",
      validation: "Please fill in all required fields"
    },
    hi: {
      title: "नया मामला जोड़ें",
      caseNumber: "क्रमांक संख्या",
      name: "नाम",
      filingDate: "डायरा दिनांक",
      petitionNumber: "रीट संख्या",
      noticeNumber: "नोटिस संख्या",
      writType: "रीट प्रकार",
      department: "विभाग",
      affidavitDueDate: "प्रतिसपथ पत्र दाखिल करने हेतु निर्धारित तिथि",
      affidavitSubmissionDate: "प्रतिसपथ पत्र दाखिल होने की तिथि",
      save: "मामला सहेजें",
      cancel: "रद्द करें",
      selectDate: "तिथि चुनें",
      selectDepartment: "विभाग चुनें",
      selectWritType: "रीट प्रकार चुनें",
      saved: "मामला सफलतापूर्वक सहेज दिया गया है",
      validation: "कृपया सभी आवश्यक फ़ील्ड भरें"
    }
  };
  
  const t = translations[currentLang];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (
      !formData.caseNumber ||
      !formData.name ||
      !formData.filingDate ||
      !formData.petitionNumber ||
      !formData.department
    ) {
      toast.error(t.validation);
      return;
    }
    
    // In a real app, you would save this to the backend
    console.log('Saving case:', formData);
    
    // Show success message
    toast.success(t.saved);
    
    // Navigate back to department page
    navigate('/dashboard');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-jansunwayi-navy mb-6">{t.title}</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.caseNumber}
              </label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="00125"
              />
            </div>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            {/* Filing Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.filingDate}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.filingDate ? (
                      format(formData.filingDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.filingDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, filingDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Petition Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.petitionNumber}
              </label>
              <input
                type="text"
                name="petitionNumber"
                value={formData.petitionNumber}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            {/* Notice Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.noticeNumber}
              </label>
              <input
                type="text"
                name="noticeNumber"
                value={formData.noticeNumber}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            {/* Writ Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.writType}
              </label>
              <select
                name="writType"
                value={formData.writType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">{t.selectWritType}</option>
                {writTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {currentLang === 'hi' ? type.name_hi : type.name_en}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.department}
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">{t.selectDepartment}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {currentLang === 'hi' ? dept.name_hi : dept.name_en}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Affidavit Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.affidavitDueDate}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.affidavitDueDate ? (
                      format(formData.affidavitDueDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.affidavitDueDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, affidavitDueDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Affidavit Submission Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.affidavitSubmissionDate}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.affidavitSubmissionDate ? (
                      format(formData.affidavitSubmissionDate, "PPP")
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.affidavitSubmissionDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, affidavitSubmissionDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              {t.cancel}
            </Button>
            <Button type="submit">
              {t.save}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCasePage;
