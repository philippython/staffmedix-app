import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import ApplicationsPage from "../features/applications/Applications";

export default function ApplicationsPageLayout() {
  return (
    <>
      <AppNav />
      <ApplicationsPage />
      <Footer />
    </>
  );
}
