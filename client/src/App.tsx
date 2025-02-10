import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DoctorListComponent from "./components/AdminDoctor/DoctorList";
import DoctorInfor from "./components/AdminDoctor/DoctorDetail";
import PatientListComponent from "./components/AdminPatient/PatientList";
import PatientInfor from "./components/AdminPatient/PatientInfor";
const App: React.FC = () => {
  return (
    <Router>
      <div className="App flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="w-full p-4">
            <Routes>
              <Route path="/" element={<DoctorListComponent />} />
              <Route path="/doctorDetail" element={<DoctorInfor />} />
              <Route path="/patientList" element={<PatientListComponent />} />
              <Route path="/patientInfor" element={<PatientInfor />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
