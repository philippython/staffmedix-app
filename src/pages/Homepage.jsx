import AppNav from "../components/layout/AppNav";
import Hero from "../components/layout/Hero";
import HowItWorks from "../components/layout/HowItWorks";
import Testimoials from "../components/layout/Testimonals";
import CTA from "../components/layout/CTA";
import Footer from "../components/layout/Footer";

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
