import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import EmployeeDashboard from "../features/dashboard/EmployeeDashboard";

export default function EmployeeDashboardPage() {
  return (
    <>
      <AppNav />
      <EmployeeDashboard />
      <Footer />
    </>
  );
}
