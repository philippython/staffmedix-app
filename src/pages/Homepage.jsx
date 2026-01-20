import AppNav from "../components/layout/ui/app/AppNav";
import Hero from "../components/layout/ui/home/Hero";
import HowItWorks from "../components/layout/ui/home/HowItWorks";
import Testimoials from "../components/layout/ui/home/Testimonals";
import CTA from "../components/layout/ui/home/CTA";
import Footer from "../components/layout/ui/app/Footer";

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
