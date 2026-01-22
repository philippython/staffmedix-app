import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import EmployerDashboard from "../components/layout/ui/employer/EmployerDashboard";

export default function EmployerDashboardPage() {
  return (
    <>
      <AppNav />
      <EmployerDashboard />
      <Footer />
    </>
  );
}
