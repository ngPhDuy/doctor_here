import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmailIcon from "./SVG/EmailIcon";
import DoctorIcon from "./SVG/DoctorIcon";
import PatientIcon from "./SVG/PatientIcon";
import TransIcon from "./SVG/TransIcon";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách các đường dẫn tương ứng với từng mục
  const doctorPages = ["/doctorDetail", "/doctorSchedule"];
  const transactionPages = ["/transactions", "/paymentHistory"];
  const patientPages = ["/patientList", "/patientInfor"];
  const requestPages = [
    "/oldRequests",
    "/oldRequestDetail",
    "/newRequests",
    "/newRequestDetail",
    "/pendingRequests",
  ];

  // Hàm kiểm tra đường dẫn có nằm trong danh sách không
  const isActive = (paths: string[]) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  // Màu mặc định và màu khi active
  const defaultColor = "text-gray-700";
  const activeColor = "text-blueTitle";

  return (
    <div className="w-64 h-screen border-r border-gray-300 shadow-md">
      <nav className="m-3">
        <ul className="pt-10">
          <li
            className={`px-6 py-3 flex text-lg hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(doctorPages) || location.pathname == "/"
                ? activeColor
                : defaultColor
            }`}
            onClick={() => navigate(`/`)}
          >
            <DoctorIcon
              size={30}
              color={
                isActive(doctorPages) || location.pathname == "/"
                  ? "blue"
                  : "gray"
              }
            />
            <span className="ml-2">Bác sĩ</span>
          </li>
          <li
            className={`px-6 py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(transactionPages) ? activeColor : defaultColor
            }`}
            onClick={() => navigate(`/transactions`)}
          >
            <TransIcon
              size={30}
              color={isActive(transactionPages) ? "blue" : "gray"}
            />
            <span className="ml-2">Giao dịch</span>
          </li>
          <li
            className={`px-6 py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(patientPages) ? activeColor : defaultColor
            }`}
            onClick={() => navigate(`/patientList`)}
          >
            <PatientIcon
              size={30}
              color={isActive(patientPages) ? "blue" : "gray"}
            />
            <span className="ml-2">Bệnh nhân</span>
          </li>
          <li
            className={`px-6 py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(requestPages) ? activeColor : defaultColor
            }`}
            onClick={() => navigate(`/oldRequests`)}
          >
            <EmailIcon
              width={30}
              height={30}
              color={isActive(requestPages) ? "blue" : "gray"}
            />
            <span className="ml-2">Yêu cầu</span>
          </li>
        </ul>
        <hr className="mt-10" />
      </nav>
    </div>
  );
};

export default Sidebar;
