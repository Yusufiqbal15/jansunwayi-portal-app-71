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

// In a real app, replace this with your actual API call
// Example mock fetching function
const fetchCases = async (): Promise<Case[]> => {
  console.log("Fetching cases...");

  // --------------------------------------------------------------
  // --- REPLACE THE MOCK DATA BELOW WITH YOUR REAL API CALL ---
  // --------------------------------------------------------------

  // Example using fetch (adjust the URL and headers as needed)
  /*
  try {
    const response = await fetch('/api/cases'); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error(`Error fetching cases: ${response.statusText}`);
    }
    const data = await response.json();
    // You might need to transform the data structure if it doesn't exactly match the 'Case' interface
    return data as Case[]; // Assuming your API returns an array matching the Case type
  } catch (error) {
    console.error("API call failed:", error);
    throw error; // Re-throw to be caught by react-query
  }
  */

  // --------------------------------------------------------------
  // --- CURRENT MOCK DATA (REMOVE THIS IN REAL IMPLEMENTATION) ---
  // --------------------------------------------------------------
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock data
  const today = new Date();
  const cases: Case[] = [];

  // Generate mock cases for departments
  for (let i = 1; i <= 48; i++) {
    const departmentId = i;
    const totalForDept = Math.floor(Math.random() * 30); // Random cases per department

    for (let j = 0; j < totalForDept; j++) {
      const status = Math.random() > 0.4 ? 'Pending' : 'Resolved'; // More pending cases
      const filingDate = new Date(today);
      filingDate.setDate(today.getDate() - Math.floor(Math.random() * 365)); // Random filing date

      cases.push({
        id: `${departmentId}-${j}`,
        caseNumber: `CASE-${departmentId}-${j}`,
        name: `Case for Dept ${departmentId}-${j}`,
        filingDate,
        petitionNumber: `PET-${departmentId}-${j}`,
        noticeNumber: `NOTICE-${departmentId}-${j}`,
        writType: 'writ', // simplified
        department: departmentId,
        status,
        hearingDate: status === 'Pending' && Math.random() > 0.5 ? new Date(today.setDate(today.getDate() + Math.floor(Math.random() * 30))) : null,
        reminderSent: false,
        affidavitDueDate: null,
        affidavitSubmissionDate: null,
        counterAffidavitRequired: false,
        reminderSentCount: 0,
      });
    }
  }

  return cases;
  // --------------------------------------------------------------
};

export { fetchCases }; 