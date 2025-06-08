import React from 'react';
import Header from '../Header';

const caseData = [
  { id: 1, name: "Tehsildar Rudauli", total: 15, pending: 9, resolved: 6 },
  { id: 2, name: "Tehsildar Milkipur", total: 15, pending: 5, resolved: 10 },
  { id: 3, name: "Tehsildar Sohawal", total: 15, pending: 9, resolved: 6 },
  { id: 4, name: "Shri Raj Bahadur Verma, Nayab Tehsildar (Survey)", total: 15, pending: 3, resolved: 12 },
  { id: 5, name: "Shri Ravindra Nath Upadhyay, Nayab Tehsildar (Nazul)", total: 15, pending: 10, resolved: 5 },
  { id: 6, name: "Sub-District Magistrate, Rudauli", total: 15, pending: 6, resolved: 9 },
  { id: 7, name: "Sub-District Magistrate, Milkipur", total: 15, pending: 9, resolved: 6 },
  { id: 8, name: "Sub-District Magistrate, Sohawal", total: 15, pending: 7, resolved: 8 },
  { id: 9, name: "Assistant Record Officer", total: 15, pending: 6, resolved: 9 },
  { id: 10, name: "Tehsildar Sadar", total: 15, pending: 11, resolved: 4 },
  { id: 11, name: "Tehsildar Bikapur", total: 15, pending: 5, resolved: 10 },
  { id: 12, name: "Addl. District Magistrate (Land Acquisition)", total: 15, pending: 6, resolved: 9 },
  { id: 13, name: "City Magistrate", total: 15, pending: 11, resolved: 4 },
  { id: 14, name: "Resident Magistrate", total: 15, pending: 7, resolved: 8 },
  { id: 15, name: "Deputy Divisional Consolidation", total: 15, pending: 8, resolved: 7 },
  { id: 16, name: "Sub Divisional Magistrate Sadar", total: 15, pending: 11, resolved: 4 },
  { id: 17, name: "Sub-District Magistrate, Bikapur", total: 15, pending: 9, resolved: 6 },
  { id: 18, name: "Chief Development Officer", total: 15, pending: 11, resolved: 4 },
  { id: 19, name: "Addl. District Magistrate (Finance / Revenue) Ayodhya", total: 15, pending: 6, resolved: 9 },
  { id: 20, name: "Addl. District Magistrate (City), Ayodhya", total: 15, pending: 4, resolved: 11 },
  { id: 21, name: "Addl. District Magistrate (Administration)", total: 15, pending: 10, resolved: 5 },
  { id: 22, name: "Chief Revenue Officer", total: 15, pending: 8, resolved: 7 },
  { id: 23, name: "Addl. District Magistrate (Law & Order)", total: 15, pending: 4, resolved: 11 },
];


const CaseStatsTable = ({ departmentId, currentLang, onBack }: { departmentId: number, currentLang: 'en' | 'hi', onBack: () => void }) => (
  <div className="relative min-h-[300px] font-bold pt-20">
    {/* ...other content... */}
    <button
      onClick={onBack}
      className="fixed right-8 bottom-8 px-4 py-2 bg-blue-600 text-white rounded shadow-lg z-50 font-bold"
      style={{ minWidth: 100, zIndex: 1000, marginBottom: '80px' /* adjust if needed */ }}
    >
      {currentLang === 'hi' ? 'वापस' : 'Back'}
    </button>
  </div>
);

const SubDepartmentData = ({ isLoggedIn = true }: { isLoggedIn?: boolean }) => {
  return (
    <div>
      {isLoggedIn && <Header isLoggedIn={true} currentLang="en" toggleLanguage={() => {}} />}
      <div className="overflow-x-auto p-4 font-bold">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-blue-100 text-gray-800">
              <th className="py-2 px-4 border-b font-bold">#</th>
              <th className="py-2 px-4 border-b text-left font-bold">Department / Officer</th>
              <th className="py-2 px-4 border-b text-blue-700 font-bold">Total Cases</th>
              <th className="py-2 px-4 border-b text-yellow-600 font-bold">Pending Cases</th>
              <th className="py-2 px-4 border-b text-green-700 font-bold">Resolved Cases</th>
            </tr>
          </thead>
          <tbody>
            {caseData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center font-bold">{index + 1}</td>
                <td className="py-2 px-4 border-b font-bold">{item.name}</td>
                <td className=" border-b text-center p-2 bg-blue-100  text-blue-700 font-bold ">{item.total}</td>
                <td className=" border-b text-center p-2 bg-yellow-100 text-yellow-600 font-bold">{item.pending}</td>
                <td className=" border-b text-center p-2 bg-green-100 text-green-700 font-bold">{item.resolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubDepartmentData;
