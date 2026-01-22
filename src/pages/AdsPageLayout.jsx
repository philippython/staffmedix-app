import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import AdsPage from "../components/layout/ui/ads/AdsPage";

export default function AdsPageLayout() {
  return (
    <>
      <AppNav />
      <AdsPage />
      <Footer />
    </>
  );
}
