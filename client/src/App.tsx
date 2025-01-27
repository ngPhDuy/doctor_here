import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DoctorListComponent from "./components/DoctorList";
import DoctorInfo from "./components/DoctorInfo";
import Auth from "./components/Auth";

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
              <Route path="/doctorInfo" element={<DoctorInfo />} />
              <Route
                path="/auth"
                element={
                  <Auth
                    showModal={true}
                    toggleLoginModal={() => {}}
                    toggleRegisterModal={() => {}}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
