import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import ApplicationsPage from "../components/layout/ui/applications/Applications";

export default function ApplicationsPageLayout() {
  return (
    <>
      <AppNav />
      <ApplicationsPage />
      <Footer />
    </>
  );
}
