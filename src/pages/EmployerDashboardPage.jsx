import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import EmployerDashboard from "../features/employer/EmployerDashboard";
import { Outlet } from "react-router";

export default function EmployerDashboardPage() {
  return (
    <>
      <AppNav />
      <EmployerDashboard />
      <Outlet />
      <Footer />
    </>
  );
}
