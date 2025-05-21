
import { format } from 'date-fns';

// Helper function to check if a date is within specified days from now
export const isWithinDays = (date: Date, days: number): boolean => {
  if (!date) return false;
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
};

// Mock data generator
export const generateMockCases = (departmentId: number) => {
  const statuses = ['Pending', 'Resolved'];
  const today = new Date();
  
  return Array(15).fill(null).map((_, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const caseDate = new Date(today);
    caseDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    const hearingDate = new Date(today);
    hearingDate.setDate(today.getDate() + Math.floor(Math.random() * 14));
    
    return {
      id: `CASE-${departmentId}-${100 + index}`,
      date: caseDate,
      status,
      hearingDate: status === 'Pending' ? hearingDate : null,
      name: `Sample Case ${index + 1}`,
    };
  });
};

// Department data
export const departments = [
  { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
  { id: 2, name_en: "Finance Department", name_hi: "वित्त विभाग" },
  { id: 3, name_en: "Law Department", name_hi: "क़ानून विभाग" },
  { id: 4, name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
  { id: 5, name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
  { id: 6, name_en: "SDM Sadar", name_hi: "SDM सदर" },
];

// Sub-departments for Administration Department
export const subDepartments = [
  { id: 101, name_en: "Chief Development Officer", name_hi: "मुख्य विकास अधिकारी" },
  { id: 102, name_en: "Additional District Magistrate (Finance / Revenue) Ayodhya", name_hi: "अपर जिलाधिकारी (वित्त / राजस्व) अयोध्या" },
  { id: 103, name_en: "Additional District Magistrate (City), Ayodhya", name_hi: "अपर जिलाधिकारी (नगर), अयोध्या" },
  { id: 104, name_en: "Additional District Magistrate (Administration)", name_hi: "अपर जिलाधिकारी (प्रशासन)" },
  { id: 105, name_en: "Chief Revenue Officer", name_hi: "मुख्य राजस्व अधिकारी" },
  { id: 106, name_en: "Additional District Magistrate (Land / 310)", name_hi: "अपर जिलाधिकारी (भू / 310)" },
  { id: 107, name_en: "Additional District Magistrate (Land-220)", name_hi: "अपर जिलाधिकारी (भू—220)" },
  { id: 108, name_en: "City Magistrate", name_hi: "नगर मजिस्ट्रेट" },
  { id: 109, name_en: "Resident Magistrate", name_hi: "रेजीडेन्ट मजिस्ट्रेट" },
  { id: 110, name_en: "Deputy Divisional Consolidation", name_hi: "उप संभागीय चकबन्दी" },
  { id: 111, name_en: "Sub Divisional Magistrate Sadar", name_hi: "उप जिलाधिकारी सदर" },
];

// Language translations
export const translations = {
  en: {
    title: "Department Report",
    totalCases: "Total Cases",
    resolvedCases: "Resolved Cases",
    pendingCases: "Pending Cases",
    caseId: "Case ID",
    date: "Date",
    status: "Status",
    hearingDate: "Hearing Date",
    actions: "Actions",
    sendReminder: "Send Reminder",
    pending: "Pending",
    resolved: "Resolved",
    viewDetails: "View Details",
    addNewCase: "Add New Case",
    subDepartments: "Sub Departments",
    viewSubDepartment: "View"
  },
  hi: {
    title: "विभागीय रिपोर्ट",
    totalCases: "कुल मामले",
    resolvedCases: "निराकृत मामले",
    pendingCases: "लंबित मामले",
    caseId: "मामला आईडी",
    date: "दिनांक",
    status: "स्थिति",
    hearingDate: "सुनवाई दिनांक",
    actions: "कार्यवाही",
    sendReminder: "भेजें अनुस्मारक",
    pending: "लंबित",
    resolved: "निराकृत",
    viewDetails: "विवरण देखें",
    addNewCase: "नया मामला जोड़ें",
    subDepartments: "उप विभाग",
    viewSubDepartment: "देखें"
  }
};

export type CaseType = {
  id: string;
  date: Date;
  status: 'Pending' | 'Resolved';
  hearingDate: Date | null;
  name: string;
};

export type TranslationType = typeof translations.en;
