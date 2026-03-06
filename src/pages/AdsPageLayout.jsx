import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import AdsPage from "../features/ads/AdsPage";

export default function AdsPageLayout() {
  return (
    <>
      <AppNav />
      <AdsPage />
      <Footer />
    </>
  );
}
