import React, { useState, useEffect } from 'react';
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
import { useQueryClient } from '@tanstack/react-query';
import { fetchSubDepartments, fetchDepartments } from '@/lib/api';

const subDepartments = [
  { id: 1, name_en: "Tehsildar Rudauli", name_hi: "तहसीलदार रुदौली" },
  { id: 2, name_en: "Tehsildar Milkipur", name_hi: "तहसीलदार मिल्कीपुर" },
  { id: 3, name_en: "Tehsildar Sohawal", name_hi: "तहसीलदार सोहावल" },
  { id: 4, name_en: "Shri Raj Bahadur Verma, Nayab Tehsildar (Survey)", name_hi: "श्री राज बहादुर वर्मा, नायब तहसीलदार (सर्वे)" },
  { id: 5, name_en: "Shri Ravindra Nath Upadhyay, Nayab Tehsildar (Nazul)", name_hi: "श्री रविन्द्र नाथ उपाध्याय, नायब तहसीलदार (नजूल)" },
  { id: 6, name_en: "Sub-District Magistrate, Rudauli", name_hi: "उप-जिलाधिकारी, रुदौली" },
  { id: 7, name_en: "Sub-District Magistrate, Milkipur", name_hi: "उप-जिलाधिकारी, मिल्कीपुर" },
  { id: 8, name_en: "Sub-District Magistrate, Sohawal", name_hi: "उप-जिलाधिकारी, सोहावल" },
  { id: 9, name_en: "Assistant Record Officer", name_hi: "सहायक अभिलेख अधिकारी" },
  { id: 10, name_en: "Tehsildar Sadar", name_hi: "तहसीलदार सदर" },
  { id: 11, name_en: "Tehsildar Bikapur", name_hi: "तहसीलदार बीकापुर" },
  { id: 12, name_en: "Addl. District Magistrate (Land Acquisition)", name_hi: "अपर जिलाधिकारी (भूमि अधिग्रहण)" },
  { id: 13, name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
  { id: 14, name_en: "Resident Magistrate", name_hi: "रेजिडेंट मजिस्ट्रेट" },
  { id: 15, name_en: "Deputy Divisional Consolidation", name_hi: "उप मंडलीय समेकन" },
  { id: 16, name_en: "Sub Divisional Magistrate Sadar", name_hi: "उप मंडलीय मजिस्ट्रेट सदर" },
  { id: 17, name_en: "Sub-District Magistrate, Bikapur", name_hi: "उप-जिलाधिकारी, बीकापुर" },
  { id: 18, name_en: "Chief Development Officer", name_hi: "मुख्य विकास अधिकारी" },
  { id: 19, name_en: "Addl. District Magistrate (Finance / Revenue) Ayodhya", name_hi: "अपर जिलाधिकारी (वित्त/राजस्व) अयोध्या" },
  { id: 20, name_en: "Addl. District Magistrate (City), Ayodhya", name_hi: "अपर जिलाधिकारी (नगर), अयोध्या" },
  { id: 21, name_en: "Addl. District Magistrate (Administration)", name_hi: "अपर जिलाधिकारी (प्रशासन)" },
  { id: 22, name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
  { id: 23, name_en: "Addl. District Magistrate (Law & Order)", name_hi: "अपर जिलाधिकारी (कानून एवं व्यवस्था)" },
];

const AddCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang } = useApp();
  const queryClient = useQueryClient();
  const [departments, setDepartments] = useState<any[]>([]);
  const [subDepartments, setSubDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    caseNumber: '',
    name: '',
    filingDate: null as Date | null,
    petitionNumber: '',
    noticeNumber: '',
    writType: '',
    department: '',
    subDepartment: '',
    affidavitDueDate: null as Date | null,
    affidavitSubmissionDate: null as Date | null,
    counterAffidavitRequired: false,
  });

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
      validation: "Please fill in all required fields",
      isthecounteraffidavittobefiledornot: " Is The Counter-Affidavit to be filed or not?",
      counterAffidavitinstruction: "Counter Affidavit (instruction)",
      yes: "Yes",
      no: "No"
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
      validation: "कृपया सभी आवश्यक फ़ील्ड भरें",
      isthecounteraffidavittobefiledornot: "प्रतिसपथ पत्र पत्र दाखिल होना है या नहीं ?",
      counterAffidavitinstruction: "प्रतिसपथ पत्र (आदेश)",
      yes: "हां",
      no: "नहीं"
    }
  };

  const t = translations[currentLang];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptsData, subDeptsData] = await Promise.all([
        fetchDepartments(),
        fetchSubDepartments()
      ]);
      
      setDepartments(deptsData);
      setSubDepartments(subDeptsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to static data
      setDepartments([
        { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
        { id: 2, name_en: "Development department", name_hi: "विकास विभाग" },
        // ... add more static departments as fallback
      ]);
      setSubDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Create dynamic subDepartmentsMap that includes database sub-departments
  const createSubDepartmentsMap = () => {
    const map: { [key: number]: { id: number; name_en: string; name_hi: string }[] } = {};
    
    for (let i = 1; i <= 49; i++) {
      // Start with static sub-departments
      let deptSubDepts = [...subDepartments];
      
      // Add database sub-departments for department 1
      if (i === 1) {
        const dbSubDepts = subDepartments.map(dbSub => ({
          id: parseInt(dbSub._id.slice(-6), 16), // Use last 6 chars of _id as number
          name_en: dbSub.name || '',
          name_hi: dbSub.description || ''
        }));
        deptSubDepts = [...deptSubDepts, ...dbSubDepts];
      }
      
      map[i] = deptSubDepts;
    }
    
    return map;
  };

  const subDepartmentsMap = createSubDepartmentsMap();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { subDepartment: '' } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    toast.success(t.saved);
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
              <input
                type="text"
                name="writType"
                value={formData.writType}
                onChange={handleChange}
                className="input-field"
                placeholder={t.selectWritType}
              />
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
            {/* Sub Department */}
            {formData.department && subDepartmentsMap[Number(formData.department)] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentLang === 'hi' ? 'उप विभाग' : 'Sub Department'}
                </label>
                <select
                  name="subDepartment"
                  value={formData.subDepartment}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">{currentLang === 'hi' ? 'उप विभाग चुनें' : 'Select sub department'}</option>
                  {subDepartmentsMap[Number(formData.department)].map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {currentLang === 'hi' ? sub.name_hi : sub.name_en}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
          {/* Counter Affidavit Instruction */}
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
                  onClick={() => setFormData(prev => ({ ...prev, counterAffidavitRequired: true }))}
                  className={`px-4 py-2 rounded-md ${formData.counterAffidavitRequired ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, counterAffidavitRequired: false }))}
                  className={`px-4 py-2 rounded-md ${!formData.counterAffidavitRequired ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {t.no}
                </button>
              </div>
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
