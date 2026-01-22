import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import AdminDashboard from "../components/layout/ui/admin/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <>
      <AppNav />
      <AdminDashboard />
      <Footer />
    </>
  );
}
