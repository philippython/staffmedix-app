import AppNav from "../components/AppNav";
import Hero from "../features/home/Hero";
import Footer from "../components/Footer";
import HowItWorks from "../features/home/HowItWorks";
import Testimoials from "../features/home/Testimonals";
import CTA from "../features/home/CTA";

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
