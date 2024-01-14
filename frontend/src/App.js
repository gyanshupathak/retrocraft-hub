import { Route, Routes } from "react-router-dom";
import  Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import DashboardFreelancer from "./pages/dashboard/DashboardFreelancer";
import DashboardProducer from "./pages/dashboard/DashboardProducer";
import Jobs from "./pages/jobs/Jobs";
import People from "./pages/people/People";
import Signup from "./pages/signUp/Signup";
import Description from "./pages/description/Desc";
import ProfileFreelancer from "./pages/profile/ProfileFreelancer";
import ProfileProducer from "./pages/profile/ProfileProducer";
import { createContext } from "react";
import ViewApplicants from "./pages/applicants/ViewApplicants";

 

export const SetPopupContext = createContext();

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboardfreelancer" element={<DashboardFreelancer />} />
        <Route path="/dashboardproducer" element={<DashboardProducer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/desc" element={<Description />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profilefreelancer" element={<ProfileFreelancer />} />
        <Route path="/profileproducer" element={<ProfileProducer />} />
        <Route path="/people" element={<People />} />
        <Route path="/viewapplicants/:jobId" element={<ViewApplicants />} />



      </Routes>
    </div>
  );
}

export default App;