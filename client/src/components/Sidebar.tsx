import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmailIcon from "./SVG/EmailIcon";
import DoctorIcon from "./SVG/DoctorIcon";
import PatientIcon from "./SVG/PatientIcon";
import TransIcon from "./SVG/TransIcon";
import { FaUserDoctor, FaUserGroup } from "react-icons/fa6";
import { RiMedicineBottleFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách các đường dẫn tương ứng với từng mục
  const doctorPages = ["/", "/doctorDetail", "/doctorSchedule"];
  const transactionPages = ["/transactions", "/paymentHistory"];
  const patientPages = ["/patientList", "/patientDetail"];
  const requestPages = [
    "/oldRequests",
    "/oldRequestDetail",
    "/newRequests",
    "/newRequestDetail",
    "/pendingRequests",
  ];

  // /medicine/*
  const medicinePages = ["/medicine"];

  // Hàm kiểm tra đường dẫn có nằm trong danh sách không
  const isActive = (paths: string[]) => {
    if (location.pathname === "/" && paths.includes("/")) return true;
    return paths.some(
      (path) => location.pathname.startsWith(path) && path !== "/"
    );
  };

  return (
    <div
      className="h-full border-r border-gray-300 shadow-md"
      style={{
        width: "30%",
        maxWidth: "10rem", // Giống Doctor Sidebar
      }}
    >
      <nav>
        <ul
          className=""
          style={{
            paddingTop: "1rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
          }}
        >
          <li
            className={`psi py-3 flex text-sm font-semibold hover:bg-gray-200 cursor-pointer rounded-lg`}
            onClick={() => navigate(`/`)}
          >
            <FaUserDoctor
              size={25}
              color={isActive(doctorPages) ? "#3b82f6" : "gray"}
            />
            <span
              className={`ml-2 ${
                isActive(doctorPages) ? "text-[#3b82f6]" : "text-gray-600"
              }`}
            >
              Bác sĩ
            </span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg`}
            onClick={() => navigate(`/patientList`)}
          >
            <FaUserGroup
              size={25}
              color={isActive(patientPages) ? "#3b82f6" : "gray"}
            />
            <span
              className={`ml-2 ${
                isActive(patientPages) ? "text-[#3b82f6]" : "text-gray-600"
              }`}
            >
              Bệnh nhân
            </span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg`}
            onClick={() => navigate(`/newRequests`)}
          >
            <MdEmail
              size={25}
              color={isActive(requestPages) ? "#3b82f6" : "gray"}
            />
            <span
              className={`ml-2 ${
                isActive(requestPages) ? "text-[#3b82f6]" : "text-gray-600"
              }`}
            >
              Yêu cầu
            </span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg`}
            onClick={() => navigate(`/medicine`)}
          >
            <RiMedicineBottleFill
              size={25}
              color={isActive(medicinePages) ? "#3b82f6" : "gray"}
            />
            <span
              className={`ml-2 ${
                isActive(medicinePages) ? "text-[#3b82f6]" : "text-gray-600"
              }`}
            >
              Thuốc
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
