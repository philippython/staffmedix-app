import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import EmployeeDashboard from "../components/layout/ui/dashboard/EmployeeDashboard";

export default function EmployeeDashboardPage() {
  return (
    <>
      <AppNav />
      <EmployeeDashboard />
      <Footer />
    </>
  );
}
