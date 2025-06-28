// Define a type for your case data (matches the structure in getMockCase)
export interface Case {
  id: string | number; // Assuming ID could be number or string
  caseNumber: string;
  name: string;
  filingDate: Date;
  petitionNumber: string;
  noticeNumber: string;
  writType: string; // e.g., 'writ', 'pil'
  department: number; // Department ID
  status: 'Pending' | 'Resolved'; // Status
  hearingDate: Date | null;
  reminderSent: boolean;
  affidavitDueDate: Date | null;
  affidavitSubmissionDate: Date | null;
  counterAffidavitRequired: boolean;
  reminderSentCount: number;
}

// Cache for departments and sub-departments
let departmentsCache: any[] | null = null;
let subDepartmentsCache: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchCases = async () => {
  try {
    const response = await fetch('http://localhost:5000/cases');
    if (!response.ok) {
      throw new Error(`Error fetching cases: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export const saveSubDepartment = async (departmentId: number, subDeptNameEn: string, subDeptNameHi: string) => {
  try {
    console.log('API: Saving sub-department with data:', { departmentId, subDeptNameEn, subDeptNameHi });
    
    const response = await fetch('http://localhost:5000/sub-departments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        departmentId,
        subDeptNameEn,
        subDeptNameHi
      }),
    });
    
    console.log('API: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Error response:', errorText);
      throw new Error(`Error saving sub-department: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API: Success response:', result);
    
    // Clear cache immediately when new data is added
    subDepartmentsCache = null;
    cacheTimestamp = 0; // Force cache refresh
    
    return result;
  } catch (error) {
    console.error("API: saveSubDepartment failed:", error);
    throw error;
  }
};

export const fetchSubDepartments = async (departmentId?: number) => {
  try {
    console.log('API: Fetching sub-departments for departmentId:', departmentId);
    
    // Force clear cache for debugging
    subDepartmentsCache = null;
    cacheTimestamp = 0;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const url = departmentId 
      ? `http://localhost:5000/sub-departments?departmentId=${departmentId}`
      : 'http://localhost:5000/sub-departments';
    
    console.log('API: Fetching from URL:', url);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    console.log('API: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Error fetching sub-departments: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API: Received sub-departments data:', data);
    
    subDepartmentsCache = data;
    cacheTimestamp = Date.now();
    
    return data;
  } catch (error) {
    console.error("API: fetchSubDepartments failed:", error);
    // Return cached data if available, even if expired
    if (subDepartmentsCache) {
      if (departmentId) {
        return subDepartmentsCache.filter(sub => sub.departmentId === departmentId);
      }
      return subDepartmentsCache;
    }
    throw error;
  }
};

// Add department API functions
export const fetchDepartments = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (departmentsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return departmentsCache;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch('http://localhost:5000/departments', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error fetching departments: ${response.statusText}`);
    }
    
    const data = await response.json();
    departmentsCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    // Return cached data if available, even if expired
    if (departmentsCache) {
      return departmentsCache;
    }
    throw error;
  }
};

export const fetchDepartmentById = async (id: number) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`http://localhost:5000/departments/${id}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error fetching department: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}; 