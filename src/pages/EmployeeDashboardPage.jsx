import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import EmployeeDashboard from "../features/dashboard/EmployeeDashboard";
import { Outlet } from "react-router";

export default function EmployeeDashboardPage() {
  return (
    <>
      <AppNav />
      <EmployeeDashboard />
      <Outlet />
      <Footer />
    </>
  );
}
