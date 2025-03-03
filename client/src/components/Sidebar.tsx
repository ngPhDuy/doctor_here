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
  const patientPages = ["/patientList", "/patientDetail"];
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
    <div className="h-screen border-r border-gray-300 shadow-md"
    style = {{
      width: "30%",
      maxWidth: "180px",
    }}>
      <nav className="">
        <ul className="" style={{paddingTop: "1rem"}}>
          <li
            className={`psi py-3 flex text-lg hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(doctorPages) || location.pathname == "/"
                ? activeColor
                : defaultColor
            }`}
            onClick={() => navigate(`/`)}
          >
            <DoctorIcon
              size={25}
              color={
                isActive(doctorPages) || location.pathname == "/"
                  ? "blue"
                  : "gray"
              }
            />
            <span className="ml-2">Bác sĩ</span>
          </li>
          <li
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(patientPages) ? activeColor : defaultColor
            }`}
            onClick={() => navigate(`/patientList`)}
          >
            <PatientIcon
              size={25}
              color={isActive(patientPages) ? "blue" : "gray"}
            />
            <span className="ml-2">Bệnh nhân</span>
          </li>
          <li
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(requestPages) ? activeColor : defaultColor
            }`}
            onClick={() => navigate(`/newRequests`)}
          >
            <EmailIcon
              width={25}
              height={25}
              color={isActive(requestPages) ? "blue" : "gray"}
            />
            <span className="ml-2">Yêu cầu</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
