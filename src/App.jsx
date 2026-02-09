import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoutes from "./routes/ProtectedRoutes";

// Existing Pages
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

// Existing Components
import JobOpeningDetails from "./features/jobs/JobOpeningDetails";
import AppNav from "./components/AppNav";
import Footer from "./components/Footer";

// Auth Components
import AdminSigin from "./features/auth/AdminSignin";
import EmployeeSignup from "./features/auth/EmployeeSignup";
import EmployerSignup from "./features/auth/EmployerSignup";
import PasswordReset from "./features/auth/PasswordReset";
import PasswordResetConfirm from "./features/auth/PasswordResetConfirm";

// Employer Components
import BrowseTalents from "./features/talents/BrowseTalents";
import JobEditView from "./features/employer/JobEdit";
import ViewJobApplications from "./features/employer/ViewJobApplications";
import AllJobPostsList from "./features/employer/AllJobPostsList";
import EmployerSettings from "./features/employer/EmployerSettings";
import JobPostForm from "./features/employer/JobPostForm";
import EmployerDetail from "./features/employer/EmployerDetail";
import ViewAllEmployerApplications from "./features/employer/ViewAllEmployerApplications";
import EmployerAdsManager from "./features/employer/EmployerAdsManager";

// Interview Page
import InterviewsPage from "./pages/InterviewsPage";

// Talent Components
import TalentDetailView from "./features/talents/TalentDetailView";
import TalentProfileEdit from "./features/talents/TalentProfileEdit";

// Admin Components
import AdminVerification from "./features/admin/AdminVerification";
import AdminAnalytics from "./features/admin/AdminAnalytics";
import AdminAdsManager from "./features/admin/AdminAdsManager";
// import EmployerVerification from "./features/admin/EmployerVerification";
// import AdminViewAllUsers from "./features/admin/AdminViewAllUsers";
// import AdminCreateUser from "./features/admin/AdminCreateUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route index path="/" element={<Homepage />} />

        {/* Jobs */}
        <Route path="/jobs">
          <Route index element={<JobPosting />} />
          <Route path=":jobId" element={<JobOpeningDetails />} />
        </Route>

        {/* Authentication */}
        <Route path="/auth">
          <Route index element={<Authentication />} />
          <Route path="admin" element={<AdminSigin />} />
          <Route path="employee-signup" element={<EmployeeSignup />} />
          <Route path="employer-signup" element={<EmployerSignup />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route
            path="password-reset-confirm/:token"
            element={<PasswordResetConfirm />}
          />
        </Route>

        {/* Employee Routes */}
        <Route element={<ProtectedRoutes group="talent" />}>
          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboardPage />}
          />
          <Route
            path="/employee-dashboard/applications"
            element={<ApplicationsPageLayout />}
          />
          <Route
            path="/employee-dashboard/profile/edit"
            element={
              <>
                <AppNav />
                <TalentProfileEdit />
                <Footer />
              </>
            }
          />
          <Route
            path="/employee-dashboard/interviews"
            element={<InterviewsPage />}
          />
        </Route>

        {/* Employer Routes */}
        <Route element={<ProtectedRoutes group="employer" />}>
          <Route
            path="/employer-dashboard"
            element={<EmployerDashboardPage />}
          />
          <Route
            path="/employer-dashboard/post-job"
            element={
              <>
                <AppNav />
                <JobPostForm />
                <Footer />
              </>
            }
          />
          <Route
            path="/employer-dashboard/job-edit/:id"
            element={
              <>
                <AppNav />
                <JobEditView />
                <Footer />
              </>
            }
          />
          <Route
            path="/employer-dashboard/view-applications/:jobId"
            element={
              <>
                <AppNav />
                <ViewJobApplications />
                <Footer />
              </>
            }
          />
          <Route
            path="/employer-dashboard/all-job-posts"
            element={
              <>
                <AppNav />
                <AllJobPostsList />
                <Footer />
              </>
            }
          />
          <Route
            path="/employer-dashboard/interviews"
            element={
              <>
                <InterviewsPage />
              </>
            }
          />
          <Route
            path="/employer-dashboard/settings"
            element={
              <>
                <AppNav />
                <EmployerSettings />
                <Footer />
              </>
            }
          />
          <Route
            path="/employer-dashboard/applications"
            element={
              <>
                <AppNav />
                <ViewAllEmployerApplications />
                <Footer />
              </>
            }
          />
          <Route
            path="/employer-dashboard/ads-manager"
            element={
              <>
                <AppNav />
                <EmployerAdsManager />
                <Footer />
              </>
            }
          />
        </Route>

        <Route
          path="/talents"
          element={
            <>
              <AppNav />
              <BrowseTalents />
              <Footer />
            </>
          }
        />

        <Route
          path="/talent/:id"
          element={
            <>
              <AppNav />
              <TalentDetailView />
              <Footer />
            </>
          }
        />

        <Route
          path="/organization/:id"
          element={
            <>
              <AppNav />
              <EmployerDetail />
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route element={<ProtectedRoutes group="employer" />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

          <Route
            path="/admin-dashboard/verification"
            element={
              <>
                <AppNav />
                <AdminVerification />
                <Footer />
              </>
            }
          />

          <Route
            path="/admin-dashboard/analytics"
            element={
              <>
                <AppNav />
                <AdminAnalytics />
                <Footer />
              </>
            }
          />

          <Route
            path="/admin-dashboard/ads-manager"
            element={
              <>
                <AppNav />
                <AdminAdsManager />
                <Footer />
              </>
            }
          />

          {/* Uncomment when created
          <Route path="hospital-verification" element={
            <>
              <AppNav />
              <HospitalVerification />
              <Footer />
            </>
          } />
          
          <Route path="all-users" element={
            <>
              <AppNav />
              <AdminViewAllUsers />
              <Footer />
            </>
          } />
          
          <Route path="create-user" element={
            <>
              <AppNav />
              <AdminCreateUser />
              <Footer />
            </>
          } />
          */}
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
