import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DoctorListComponent from "./components/AdminDoctor/DoctorList";
import DoctorInfor from "./components/AdminDoctor/DoctorDetail";
import PatientListAdminComponent from "./components/AdminPatient/PatientList";
import PatientDetail from "./components/AdminPatient/PatientDetail";
import OldRequestComponent from "./components/AdminRequest/OldRequest";
import NewRequestComponent from "./components/AdminRequest/NewRequest";
import NewRequestDetail from "./components/AdminRequest/NewRequestDetail";
import HistoryListComponent from "./components/DoctorHistory/HistoryList";
import HistoryDetailComponent from "./components/DoctorHistory/HistoryDetail";
import PatientListDoctorComponent from "./components/DoctorPatient/PatientList";
import PatientDetailInfo from "./components/DoctorPatient/PatientDetailInfo";
import PatientDetailHistory from "./components/DoctorPatient/PatientDetailHistory";
import DoctorSettingInfo from "./components/DoctorSetting/DoctorSettingInfo";
import DoctorRequest from "./components/DoctorSetting/DoctorRequest";
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
              <Route path="/doctorDetail/:id" element={<DoctorInfor />} />
              <Route path="/patientList" element={<PatientListAdminComponent />} />
              <Route path="/patientDetail/:id" element={<PatientDetail />} />
              <Route path="/oldRequests" element={<OldRequestComponent />} />
              <Route path="/newRequests" element={<NewRequestComponent />} />
              <Route
                path="/newRequestDetail/:requestId/:doctorId"
                element={<NewRequestDetail />}
              />
              <Route
                path="/historyList"
                element={<HistoryListComponent />}
              />
              <Route
                path="/historyDetail/:id"
                element={<HistoryDetailComponent />}
              />
              <Route
                path="/patientListDoctor"
                element={<PatientListDoctorComponent />}
              />
              <Route
                path="/patientInfoDoctor/:id"
                element={<PatientDetailInfo />}
              />
              <Route
                path="/patientDetailHistory/:patientId"
                element={<PatientDetailHistory />}
              />
              <Route
                path="/doctorSettingInfo"
                element={<DoctorSettingInfo />}
              />
              <Route
                path="/doctorRequest"
                element={<DoctorRequest />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
