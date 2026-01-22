import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import NotificationsPage from "../components/layout/ui/notifications/NotificationsPage";

export default function NotificationsPageLayout() {
  return (
    <>
      <AppNav />
      <NotificationsPage />
      <Footer />
    </>
  );
}
