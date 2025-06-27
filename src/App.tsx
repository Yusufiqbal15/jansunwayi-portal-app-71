import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DepartmentPage from "./pages/DepartmentPage";
import AddCasePage from "./pages/AddCasePage";
import CaseDetailPage from "./pages/CaseDetailPage";
import NotFound from "./pages/NotFound";
import SubDepartmentPage from '@/pages/SubDepartmentPage';
import HomePage from '@/pages/HomePage';
import CasesPage from '@/pages/CasesPage';
import ReportsPage from './pages/ReportsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="/" element={<Layout requireAuth />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="department/:id" element={<DepartmentPage />} />
              <Route path="sub-department/:id" element={<SubDepartmentPage />} />
              <Route path="add-case" element={<AddCasePage />} />
              <Route path="case/:id" element={<CaseDetailPage />} />
            </Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
