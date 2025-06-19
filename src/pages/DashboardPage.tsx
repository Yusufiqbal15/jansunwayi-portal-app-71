import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { currentLang } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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
    { id: 49, name_en: "Nagar Nigam Ayodhya", name_hi: "नगर निगम अयोध्या" },
  ];
  
  const translations = {
    en: {
      title: "Department List",
      subtitle: "Select a department to view its reports",
      searchPlaceholder: "Search departments..."
    },
    hi: {
      title: "विभाग सूची",
      subtitle: "रिपोर्ट देखने के लिए एक विभाग चुनें",
      searchPlaceholder: "विभाग खोजें..."
    }
  };
  
  const t = translations[currentLang];

  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dept.name_en.toLowerCase().includes(searchLower) ||
      dept.name_hi.includes(searchQuery)
    );
  });
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jansunwayi-navy">{t.title}</h1>
        <p className="text-jansunwayi-darkgray">{t.subtitle}</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => (
          <Link to={`/department/${dept.id}`} key={dept.id}>
            <Card className="bg-White-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 ...">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {currentLang === 'hi' ? dept.name_hi : dept.name_en}
                </h2>
                <div className="h-1 w-16 bg-jansunwayi-saffron rounded-full mb-4"></div>
                <p className="text-jansunwayi-darkgray">
                  {currentLang === 'en' ? 'View Reports' : 'रिपोर्ट देखें'}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {currentLang === 'en' ? 'No departments found' : 'कोई विभाग नहीं मिला'}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
