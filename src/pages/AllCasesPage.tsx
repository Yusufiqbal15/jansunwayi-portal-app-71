import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, RefreshCw, Filter } from 'lucide-react';
import { fetchCases, fetchSubDepartments, fetchDepartments } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AllCasesPage: React.FC = () => {
  const { subDepartmentId } = useParams<{ subDepartmentId: string }>();
  const navigate = useNavigate();
  const { currentLang } = useApp();
  const [cases, setCases] = useState<any[]>([]);
  const [subDepartment, setSubDepartment] = useState<any>(null);
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (subDepartmentId) {
      fetchData();
    }
  }, [subDepartmentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('AllCasesPage: Fetching data for sub-department:', subDepartmentId);

      // Fetch sub-department details
      const subDepts = await fetchSubDepartments();
      const currentSubDept = subDepts.find(sub => 
        sub._id === subDepartmentId || sub.id === parseInt(subDepartmentId || '0')
      );
      
      if (!currentSubDept) {
        toast.error(currentLang === 'hi' ? 'उप-विभाग नहीं मिला' : 'Sub-department not found');
        navigate('/dashboard');
        return;
      }

      setSubDepartment(currentSubDept);

      // Fetch department details
      const departments = await fetchDepartments();
      const currentDept = departments.find(dept => dept.id === currentSubDept.departmentId);
      setDepartment(currentDept);

      // Fetch cases for this sub-department using the sub-department's _id
      const casesData = await fetchCases({
        subDepartment: currentSubDept._id,
        limit: 100
      });

      console.log('AllCasesPage: Received cases:', casesData);
      setCases(casesData.cases || casesData || []);

    } catch (error) {
      console.error('AllCasesPage: Error fetching data:', error);
      toast.error(currentLang === 'hi' ? 'डेटा लोड करने में त्रुटि' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success(currentLang === 'hi' ? 'डेटा रिफ्रेश किया गया' : 'Data refreshed');
  };

  const handleAddCase = () => {
    navigate(`/add-case?subDepartment=${subDepartmentId}`);
  };

  const handleCaseClick = (caseId: string) => {
    navigate(`/case/${caseId}`);
  };

  // Filter cases based on search and status
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = searchQuery === '' || 
      caseItem.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.petitionNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'Contempt' ? caseItem.writType === 'Contempt' : caseItem.status === statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  const translations = {
    en: {
      title: "All Cases",
      subtitle: "Cases for",
      addCase: "Add New Case",
      searchPlaceholder: "Search cases...",
      refresh: "Refresh",
      filter: "Filter",
      allStatus: "All Status",
      pending: "Pending",
      resolved: "Resolved",
      contempt: "Contempt",
      caseNumber: "Case Number",
      name: "Name",
      filingDate: "Filing Date",
      status: "Status",
      hearingDate: "Hearing Date",
      actions: "Actions",
      viewDetails: "View Details",
      noCases: "No cases found",
      noCasesMessage: "No cases have been added for this sub-department yet.",
      totalCases: "Total Cases",
      pendingCases: "Pending Cases",
      resolvedCases: "Resolved Cases",
      contemptCases: "Contempt Cases"
    },
    hi: {
      title: "सभी मामले",
      subtitle: "के मामले",
      addCase: "नया मामला जोड़ें",
      searchPlaceholder: "मामले खोजें...",
      refresh: "रिफ्रेश",
      filter: "फ़िल्टर",
      allStatus: "सभी स्थिति",
      pending: "लंबित",
      resolved: "निपटाया गया",
      contempt: "अवमानना",
      caseNumber: "मामला संख्या",
      name: "नाम",
      filingDate: "दाखिल करने की तिथि",
      status: "स्थिति",
      hearingDate: "सुनवाई की तिथि",
      actions: "कार्रवाई",
      viewDetails: "विवरण देखें",
      noCases: "कोई मामला नहीं मिला",
      noCasesMessage: "इस उप-विभाग के लिए अभी तक कोई मामला नहीं जोड़ा गया है।",
      totalCases: "कुल मामले",
      pendingCases: "लंबित मामले",
      resolvedCases: "निपटाए गए मामले",
      contemptCases: "अवमानना मामले"
    }
  };

  const t = translations[currentLang];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jansunwayi-blue"></div>
          <span className="ml-3 text-jansunwayi-darkgray">
            {currentLang === 'hi' ? 'डेटा लोड हो रहा है...' : 'Loading data...'}
          </span>
        </div>
      </div>
    );
  }

  if (!subDepartment) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {currentLang === 'hi' ? 'उप-विभाग नहीं मिला' : 'Sub-department not found'}
          </p>
        </div>
      </div>
    );
  }

  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.status === 'Pending').length;
  const resolvedCases = cases.filter(c => c.status === 'Resolved').length;
  const contemptCases = cases.filter(c => c.writType === 'Contempt').length;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-jansunwayi-navy">
              {t.title}
            </h1>
            <p className="text-jansunwayi-darkgray mt-2">
              {t.subtitle} {currentLang === 'hi' ? subDepartment.name_hi : subDepartment.name_en}
            </p>
            {department && (
              <p className="text-sm text-gray-500 mt-1">
                {currentLang === 'hi' ? 'विभाग:' : 'Department:'} {currentLang === 'hi' ? department.name_hi : department.name_en}
              </p>
            )}
          </div>
          <Button onClick={handleAddCase} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            {t.addCase}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-jansunwayi-blue text-white">
          <div className="p-4 text-center">
            <h3 className="text-sm font-medium mb-1">{t.totalCases}</h3>
            <p className="text-2xl font-bold">{totalCases}</p>
          </div>
        </Card>
        
        <Card className="bg-jansunwayi-saffron text-white">
          <div className="p-4 text-center">
            <h3 className="text-sm font-medium mb-1">{t.pendingCases}</h3>
            <p className="text-2xl font-bold">{pendingCases}</p>
          </div>
        </Card>
        
        <Card className="bg-jansunwayi-green text-white">
          <div className="p-4 text-center">
            <h3 className="text-sm font-medium mb-1">{t.resolvedCases}</h3>
            <p className="text-2xl font-bold">{resolvedCases}</p>
          </div>
        </Card>

        <Card className="bg-purple-600 text-white">
          <div className="p-4 text-center">
            <h3 className="text-sm font-medium mb-1">{t.contemptCases}</h3>
            <p className="text-2xl font-bold">{contemptCases}</p>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t.allStatus}</option>
          <option value="Pending">{t.pending}</option>
          <option value="Resolved">{t.resolved}</option>
          <option value="Contempt">{t.contempt}</option>
        </select>
        
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {t.refresh}
        </Button>
      </div>

      {/* Cases Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.caseNumber}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.name}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.filingDate}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.status}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.hearingDate}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((caseItem) => (
                <tr key={caseItem._id || caseItem.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{caseItem.caseNumber}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{caseItem.name}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {caseItem.filingDate ? format(new Date(caseItem.filingDate), 'yyyy-MM-dd') : '-'}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      caseItem.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {currentLang === 'en' ? caseItem.status : (caseItem.status === 'Pending' ? t.pending : t.resolved)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.hearingDate ? format(new Date(caseItem.hearingDate), 'yyyy-MM-dd') : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCaseClick(caseItem._id || caseItem.id)}
                    >
                      {t.viewDetails}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery || statusFilter ? t.noCases : t.noCasesMessage}
            </p>
            {!searchQuery && !statusFilter && (
              <Button onClick={handleAddCase} className="mt-4 btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                {t.addCase}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AllCasesPage; 