import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkerSignup from "./pages/WorkerSignup";
import WorkerProfile from "./pages/WorkerProfile";
import EditWorkerProfile from "./pages/EditWorkerProfile";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobPosting from "./pages/JobPosting";
import JobBoard from "./pages/JobBoard";
import JobDetails from "./pages/JobDetails";
import Pricing from "./pages/Pricing";
import AdminVerification from "./pages/AdminVerification";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/worker-signup" element={<WorkerSignup />} />
          <Route path="/profile" element={<WorkerProfile />} />
          <Route path="/profile/edit" element={<EditWorkerProfile />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/job-posting" element={<JobPosting />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin/verifications" element={<AdminVerification />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
