import { Outlet } from "react-router";
import AppNav from "../components/layout/ui/app/AppNav";
import Footer from "../components/layout/ui/app/Footer";
import Job from "../components/layout/ui/jobs/Job";

export default function JobPosting() {
  return (
    <>
      <AppNav />
      <Job />
      <Outlet />
      <Footer />
    </>
  );
}
