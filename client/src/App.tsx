import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DoctorSidebar from "./components/Doctor/Sidebar";
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
import DoctorSchedule from "./components/DoctorSetting/DoctorSchedule";
import DoctorRating from "./components/DoctorSetting/DoctorRating";
import LoginComponent from "./pages/Login";
import Conversations from "./components/DoctorMess/Conversations";
import DoctorHomepage from "./components/Doctor/DoctorHomepage";
import ResultList from "./components/DoctorResult/ResultList";
import ResultDetail from "./components/DoctorResult/ResultDetail";
import RequestDetail from "./components/DoctorSetting/RequestDetail";
import MedicineList from "./components/AdminMedicine/MedicineList";
import MedicineDetail from "./components/AdminMedicine/MedicineDetail";
import MedicineAddNew from "./components/AdminMedicine/AddNew";
import VideoCall from "./components/DoctorMess/VideoCall";
import ResultHistory from "./components/DoctorPatient/ResultHistory";
import PatientResult from "./components/DoctorPatient/PatientResult";
import ResultAccessSetting from "./components/DoctorSetting/ResultAccessSetting";

import CallNotification from "./components/Doctor/CallNotification";
import defaultAvatar from "./assets/images/avt.png";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("role");
  if (!role) {
    // Nếu không có role, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

interface AppProps {
  setUserInfo: (info: { id: string | null; name: string | null }) => void;
}

const App: React.FC<AppProps> = ({ setUserInfo }) => {
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  //Các state cho video call

  // Đảm bảo rằng state `role` được cập nhật mỗi khi giá trị trong localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("LocalStorage changed:", localStorage.getItem("role"));
      setRole(localStorage.getItem("role"));
    };

    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", handleStorageChange);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  console.log(role + " from App Component");

  return (
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route
          path="/login"
          element={
            <LoginComponent setRole={setRole} setUserInfo={setUserInfo} />
          }
        />
        {role === "bs" && (
          <Route path="/video_call/:ptID/:callId" element={<VideoCall />} />
        )}

        {/* Các route yêu cầu Header và Sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="App flex flex-col h-screen">
                <Header />
                <div className="flex flex-1">
                  {role === "qtv" && <Sidebar />}
                  {role === "bs" && <DoctorSidebar />}
                  <div className="w-full">
                    <Routes>
                      {/* Routes dành cho Admin */}
                      {role === "qtv" && (
                        <>
                          <Route path="/" element={<DoctorListComponent />} />
                          <Route
                            path="/doctorDetail/:id"
                            element={<DoctorInfor />}
                          />
                          <Route
                            path="/patientList"
                            element={<PatientListAdminComponent />}
                          />
                          <Route
                            path="/patientDetail/:id"
                            element={<PatientDetail />}
                          />
                          <Route
                            path="/oldRequests"
                            element={<OldRequestComponent />}
                          />
                          <Route
                            path="/newRequests"
                            element={<NewRequestComponent />}
                          />
                          <Route
                            path="/newRequestDetail/:requestId/:doctorId"
                            element={<NewRequestDetail />}
                          />
                          <Route path="/medicine" element={<MedicineList />} />
                          <Route
                            path="/medicine/:id"
                            element={<MedicineDetail />}
                          />
                          <Route
                            path="/medicine/add"
                            element={<MedicineAddNew />}
                          />
                        </>
                      )}

                      {/* Routes dành cho Doctor */}
                      {role === "bs" && (
                        <>
                          <Route path="/" element={<DoctorHomepage />} />
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
                            path="/resultHistory/:ptID"
                            element={<ResultHistory />}
                          />
                          <Route
                            path="/patientResult/:id"
                            element={<PatientResult />}
                          />

                          <Route
                            path="/resultList/:status"
                            element={<ResultList />}
                          />
                          <Route
                            path="/resultDetail/:id"
                            element={<ResultDetail />}
                          />

                          <Route
                            path="/doctorSettingInfo"
                            element={<DoctorSettingInfo />}
                          />
                          <Route
                            path="/doctorRequest"
                            element={<DoctorRequest />}
                          />
                          <Route
                            path="/requestDetail/:requestID"
                            element={<RequestDetail />}
                          />
                          <Route
                            path="/doctorRating"
                            element={<DoctorRating />}
                          />
                          <Route
                            path="/doctorSchedule"
                            element={<DoctorSchedule />}
                          />
                          <Route
                            path="/conversations/:ptID?"
                            element={<Conversations />}
                          />
                          <Route
                            path="/resultAccessSetting"
                            element={<ResultAccessSetting />}
                          />
                        </>
                      )}
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
