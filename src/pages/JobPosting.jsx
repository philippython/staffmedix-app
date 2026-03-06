import { Outlet } from "react-router";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import Job from "../features/jobs/Job";

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
