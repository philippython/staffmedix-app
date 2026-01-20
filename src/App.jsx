import "./App.css";
import Homepage from "./pages/Homepage";
import JobPosting from "./pages/JobPosting";
import Authentication from "./pages/Authentication";

import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Homepage />}></Route>
        <Route index path="/jobs" element={<JobPosting />}></Route>
        <Route index path="/auth" element={<Authentication />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
