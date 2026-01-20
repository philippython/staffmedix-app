import "./App.css";
import Homepage from "./pages/Homepage";
import JobPosting from "./pages/JobPosting";
import Authentication from "./pages/Authentication";
import JobOpeningDetails from "./components/layout/ui/jobs/JobOpeningDetails";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Homepage />}></Route>
        <Route path="/jobs">
          <Route index element={<JobPosting />} />
          <Route path=":id" element={<JobOpeningDetails />} />
        </Route>
        <Route path="/auth" element={<Authentication />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
