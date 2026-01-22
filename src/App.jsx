import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";

// Pages
import Homepage from "./pages/Homepage";
import JobPosting from "./pages/JobPosting";
import Authentication from "./pages/Authentication";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PricingPage from "./pages/PricingPage";
import ChatPageLayout from "./pages/ChatPageLayout";
import NotificationsPageLayout from "./pages/NotificationsPageLayout";
import AdsPageLayout from "./pages/AdsPageLayout";
import ApplicationsPageLayout from "./pages/ApplicationsPageLayout";

// Components
import JobOpeningDetails from "./components/layout/ui/jobs/JobOpeningDetails";
import EmployeeSignup from "./components/layout/ui/auth/EmployeeSignup";
import EmployerSignup from "./components/layout/ui/auth/EmployerSignup";
import JobPostForm from "./components/layout/ui/employer/JobPostForm";
import AdminVerification from "./components/layout/ui/admin/AdminVerification";
import AdminAnalytics from "./components/layout/ui/admin/AdminAnalytics";
import AdminAdsManager from "./components/layout/ui/admin/AdminAdsManager";
import AppNav from "./components/layout/ui/app/AppNav";
import Footer from "./components/layout/ui/app/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route index path="/" element={<Homepage />} />

        {/* Jobs */}
        <Route path="/jobs">
          <Route index element={<JobPosting />} />
          <Route path=":id" element={<JobOpeningDetails />} />
        </Route>

        {/* Authentication */}
        <Route path="/auth">
          <Route index element={<Authentication />} />
          <Route path="employee-signup" element={<EmployeeSignup />} />
          <Route path="employer-signup" element={<EmployerSignup />} />
        </Route>

        {/* Employee Routes */}
        <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
        <Route path="/applications" element={<ApplicationsPageLayout />} />

        {/* Employer Routes */}
        <Route path="/employer-dashboard" element={<EmployerDashboardPage />} />
        <Route
          path="/post-job"
          element={
            <>
              <AppNav />
              <JobPostForm />
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<AdminDashboardPage />} />
          <Route
            path="verification"
            element={
              <>
                <AppNav />
                <AdminVerification />
                <Footer />
              </>
            }
          />
          <Route
            path="analytics"
            element={
              <>
                <AppNav />
                <AdminAnalytics />
                <Footer />
              </>
            }
          />
          <Route
            path="ads-manager"
            element={
              <>
                <AppNav />
                <AdminAdsManager />
                <Footer />
              </>
            }
          />
        </Route>

        {/* General Routes */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/chat" element={<ChatPageLayout />} />
        <Route path="/notifications" element={<NotificationsPageLayout />} />
        <Route path="/ads" element={<AdsPageLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
