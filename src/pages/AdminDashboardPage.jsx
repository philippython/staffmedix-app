import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import AdminDashboard from "../features/admin/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <>
      <AppNav />
      <AdminDashboard />
      <Footer />
    </>
  );
}
