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
import { useQueryClient } from '@tanstack/react-query';

const AddCasePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang } = useApp();
  const queryClient = useQueryClient();
  
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
    counterAffidavitRequired: false,
  });
  
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
  {id : 49, name_en : "Nagar Nigam Ayodhya " , name_hi: "नगर निगम अयोध्या "}


  ];
  
  const writTypes = [
    { value: 'writ', name_en: 'Writ', name_hi: 'रिट' },
    { value: 'pil', name_en: 'PIL', name_hi: 'पीआईएल' },
    { value: 'criminal', name_en: 'Criminal', name_hi: 'आपराधिक' },
    { value: 'civil', name_en: 'Civil', name_hi: 'नागरिक' },
    {value: 'contempt', name_en:'Contempt', name_hi : 'अनदेखी'}
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
  
  const handleSaveNewCase = async () => {
    // In a real app, send new case data to backend
    // const newCase = await api.createCase(formData); // Replace with real API call

    // Simulate adding...
    console.log("Adding new case...");
    await new Promise(resolve => setTimeout(resolve, 500));

    toast.success(currentLang === 'hi' ? 'मामला सफलतापूर्वक जोड़ा गया' : 'Case added successfully');

    // <<< ADD THIS LINE AFTER SUCCESSFUL ADDITION >>>
    queryClient.invalidateQueries({ queryKey: ['cases'] });

    navigate('/dashboard'); // Or navigate to the new case's detail page
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
