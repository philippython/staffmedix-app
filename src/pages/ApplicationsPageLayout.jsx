import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import Applications from "../features/applications/Applications";

export default function ApplicationsPageLayout() {
  return (
    <>
      <AppNav />
      <Applications />
      <Footer />
    </>
  );
}
