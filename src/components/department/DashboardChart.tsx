import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCases, Case } from '@/lib/api';
import SubDepartmentData from './SubDepartmentData';



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

// Helper to get counts for each department from a list of cases
function getDepartmentStats(deptId: number, cases: Case[] | undefined) {
  if (!cases) return { total: 0, pending: 0, resolved: 0 };

  const deptCases = cases.filter(c => c.department === deptId);
  const total = deptCases.length;
  const pending = deptCases.filter(c => c.status === 'Pending').length;
  const resolved = deptCases.filter(c => c.status === 'Resolved').length;
  return { total, pending, resolved };
}

type Props = {
  currentLang: 'en' | 'hi';
};

const DashboardChart: React.FC<Props> = ({ currentLang }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Use react-query to fetch cases
  const { data: cases, isLoading, error } = useQuery<Case[]>({
    queryKey: ['cases'],       // Unique key for this query
    queryFn: fetchCases,      // Function to fetch the data
    staleTime: 5 * 60 * 1000, // Data is considered "fresh" for 5 minutes
   
  });

  const handleClick = (departmentId: number, status: 'total' | 'pending' | 'resolved') => {
    navigate(`/cases?department=${departmentId}&status=${status}`);
  };

  // Show SubDepartmentData only for Administration Department (id: 1)
  if (selectedDeptId === 1) {
    return (
      <div>
        <button
          onClick={() => setSelectedDeptId(null)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentLang === 'hi' ? 'वापस' : 'Back'}
        </button>
        <SubDepartmentData />
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8 text-blue-700 font-semibold">Loading reports...</div>;
  }

  if (error) {
    console.error("Error fetching cases:", error);
    return <div className="text-center py-8 text-red-500 font-semibold">Error loading reports.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-6">
   
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold rounded-tl-lg">#</th>
            <th className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold">
              {currentLang === 'hi' ? 'विभाग' : 'Department'}
            </th>
            <th className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold">
              {currentLang === 'hi' ? 'कुल मामले' : 'Total Cases'}
            </th>
            <th className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold">
              {currentLang === 'hi' ? 'लंबित' : 'Pending Cases'}
            </th>
            <th className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold rounded-tr-lg">
              {currentLang === 'hi' ? 'निराकृत' : 'Resolved Cases'}
            </th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, idx) => {
            // Calculate stats based on the fetched 'cases' data
            const stats = getDepartmentStats(dept.id, cases);
            return (
              <tr key={dept.id} className="transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:bg-blue-50">
                <td className="p-3 text-center rounded-l-lg">{idx + 1}</td>
                <td

className="p-3 font-semibold cursor-pointer text-black hover:text-gray-800"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedDeptId(dept.id)}
                  onKeyPress={e => { if (e.key === 'Enter') setSelectedDeptId(dept.id); }}
                  title={currentLang === 'hi' ? 'विभाग के आँकड़े देखें' : 'View department stats'}
                >
                  {currentLang === 'hi' ? dept.name_hi : dept.name_en}
                </td>
                <td
                  className="p-3 text-center font-bold text-blue-700 bg-blue-100 rounded cursor-pointer hover:underline"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(dept.id, 'total')}
                  onKeyPress={e => { if (e.key === 'Enter') handleClick(dept.id, 'total'); }}
                  title={currentLang === 'hi' ? 'कुल मामले देखें' : 'View total cases'}
                >
                  {stats.total}
                </td>
                <td
                  className="p-3 text-center font-bold text-yellow-700 bg-yellow-100 rounded cursor-pointer hover:underline"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(dept.id, 'pending')}
                  onKeyPress={e => { if (e.key === 'Enter') handleClick(dept.id, 'pending'); }}
                  title={currentLang === 'hi' ? 'लंबित मामले देखें' : 'View pending cases'}
                >
                  {stats.pending}
                </td>
                <td
                  className="p-3 text-center font-bold text-green-700 bg-green-100 rounded-r-lg cursor-pointer hover:underline"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(dept.id, 'resolved')}
                  onKeyPress={e => { if (e.key === 'Enter') handleClick(dept.id, 'resolved'); }}
                  title={currentLang === 'hi' ? 'निराकृत मामले देखें' : 'View resolved cases'}
                >
                  {stats.resolved}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardChart;