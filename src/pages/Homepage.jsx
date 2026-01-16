import AppNav from "../components/layout/ui/AppNav";
import Hero from "../components/layout/ui/Hero";
import HowItWorks from "../components/layout/ui/HowItWorks";
import Testimoials from "../components/layout/ui/Testimonals";
import CTA from "../components/layout/ui/CTA";
import Footer from "../components/layout/ui/Footer";

export default function Homepage() {
  return (
    <>
      <AppNav />
      <Hero />
      <HowItWorks />
      <Testimoials />
      <CTA />
      <Footer />
    </>
  );
}
