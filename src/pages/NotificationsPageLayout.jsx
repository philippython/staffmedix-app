import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import NotificationsPage from "../features/notifications/NotificationsPage";

export default function NotificationsPageLayout() {
  return (
    <>
      <AppNav />
      <NotificationsPage />
      <Footer />
    </>
  );
}
