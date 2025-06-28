import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AddSubDepartmentForm from '@/components/AddSubDepartmentForm';
import { uploadDepartmentsToFirestore } from '@/utils/departmentUtils';
import { saveSubDepartment, fetchDepartments, fetchSubDepartments } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const DashboardPage: React.FC = () => {
  const { currentLang } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddSubDept, setShowAddSubDept] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDepartmentsFromDB();
  }, []);

  const fetchDepartmentsFromDB = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to static data if database fails
      setDepartments([
        { id: 1, name_en: "Administration Department", name_hi: "प्रशासन विभाग" },
        { id: 2, name_en: "Development department", name_hi: "विकास विभाग" },
        // ... add more static departments as fallback
      ]);
    } finally {
      setLoading(false);
    }
  };

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
    const nameEn = dept.name_en || '';
    const nameHi = dept.name_hi || '';
    
    return (
      nameEn.toLowerCase().includes(searchLower) ||
      nameHi.includes(searchQuery)
    );
  });
  
  // Dummy handler for form submit
  const handleAddSubDepartment = async (departmentId: number, subDeptNameEn: string, subDeptNameHi: string) => {
    try {
      console.log('Adding sub-department:', { departmentId, subDeptNameEn, subDeptNameHi });
      
      const result = await saveSubDepartment(departmentId, subDeptNameEn, subDeptNameHi);
      console.log('Sub-department added successfully:', result);
      
      toast.success(currentLang === 'hi' ? 'उप-विभाग सफलतापूर्वक जोड़ा गया' : 'Sub-department added successfully');
      setShowAddSubDept(false);
      
      // Force refresh of all data
      await fetchDepartmentsFromDB();
      
      // Show success message with details
      toast.success(
        currentLang === 'hi' 
          ? `उप-विभाग "${subDeptNameHi}" सफलतापूर्वक जोड़ा गया` 
          : `Sub-department "${subDeptNameEn}" added successfully`
      );
    } catch (error) {
      console.error('Error adding sub-department:', error);
      toast.error(currentLang === 'hi' ? 'उप-विभाग जोड़ने में त्रुटि' : 'Error adding sub-department');
    }
  };

  const handleUploadDepartments = async () => {
    await uploadDepartmentsToFirestore(departments); // <-- departments pass karein
    alert('Departments uploaded to Firestore!');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jansunwayi-navy">
          {currentLang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jansunwayi-blue"></div>
          <span className="ml-3 text-jansunwayi-darkgray">
            {currentLang === 'hi' ? 'डेटा लोड हो रहा है...' : 'Loading data...'}
          </span>
        </div>
      ) : (
        <>
          {/* Search and Add Sub-Department */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={currentLang === 'hi' ? 'विभाग खोजें...' : 'Search departments...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddSubDept(true)}
                className="btn-primary"
              >
                {currentLang === 'hi' ? 'उप विभाग जोड़ें' : 'Add Sub Department'}
              </Button>
              <Link to="/sub-departments">
                <Button variant="outline">
                  {currentLang === 'hi' ? 'सभी उप-विभाग देखें' : 'View All Sub-Departments'}
                </Button>
              </Link>
              <Button
                onClick={async () => {
                  try {
                    const subDepts = await fetchSubDepartments(1);
                    console.log('Dashboard: Test fetch sub-departments for dept 1:', subDepts);
                    toast.success(`Found ${subDepts.length} sub-departments for department 1`);
                  } catch (error) {
                    console.error('Dashboard: Test fetch failed:', error);
                    toast.error('Test fetch failed');
                  }
                }}
                variant="outline"
              >
                Test Sub-Depts
              </Button>
            </div>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((department) => (
              <Link key={department.id} to={`/department/${department.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-jansunwayi-navy mb-2">
                      {currentLang === 'hi' ? department.name_hi : department.name_en}
                    </h3>
                    <p className="text-jansunwayi-darkgray">
                      {currentLang === 'hi' ? 'क्लिक करें देखने के लिए' : 'Click to view details'}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {showAddSubDept && (
        <AddSubDepartmentForm
          departments={departments}
          currentLang={currentLang}
          onClose={() => setShowAddSubDept(false)}
          onSubmit={handleAddSubDepartment}
        />
      )}
    </div>
  );
};

export default DashboardPage;
