import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import LoginComponent from "./pages/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("role");
  if (!role) {
    // Nếu không có role, chuyển hướng về trang đăng nhập
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const role = localStorage.getItem("role"); // Kiểm tra role đã lưu trong localStorage

  console.log(role + " from App Component");

  return (
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<LoginComponent />} />

        {/* Các route yêu cầu Header và Sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="App flex flex-col h-screen">
                <Header />
                <div className="flex flex-1">
                  <Sidebar />
                  <div className="w-full p-4">
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
                        </>
                      )}

                      {/* Routes dành cho Doctor */}
                      {role === "bs" && (
                        <>
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

// const App: React.FC = () => {
//   const role = localStorage.getItem("role");

//   return (
//     <Router>
//       <Routes>
//         {/* Trang đăng nhập */}
//         <Route path="/login" element={<LoginComponent />} />

//         {/* Các route yêu cầu Header và Sidebar */}
//         <Route
//           path="/*"
//           element={
//             role ? (
//               <div className="App flex flex-col h-screen">
//                 <Header />
//                 <div className="flex flex-1">
//                   <Sidebar />
//                   <div className="w-full p-4">
//                     <Routes>
//                       {/* Routes dựa trên role */}
//                       {role === "admin" ? (
//                         <Route path="/" element={<DoctorListComponent />} />
//                       ) : role === "doctor" ? (
//                         <Route
//                           path="/historyList"
//                           element={<HistoryListComponent />}
//                         />
//                       ) : (
//                         <Route path="/" element={<LoginComponent />} />
//                       )}
//                     </Routes>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <LoginComponent />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );

// return (
//   <Router>
//     <Routes>
//       {/* Route for Login (no Header, no Sidebar) */}
//       <Route path="/login" element={<LoginComponent />} />

//       {/* Routes that require Header and Sidebar */}
//       <Route
//         path="/*"
//         element={
//           <div className="App flex flex-col h-screen">
//             <Header />
//             <div className="flex flex-1">
//               <Sidebar />
//               <div className="w-full p-4">
//                 <Routes>
//                   {/* Route for Admin */}

//                   {/* Route for Doctor */}

//                 </Routes>
//               </div>
//             </div>
//           </div>
//         }
//       />
//     </Routes>
//   </Router>
// );

export default App;
