import React from "react";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-64 h-screen border-r border-gray-300 shadow-md">
      <nav className="m-3">
        <ul className="pt-10 ">
          <li
            className="px-6 py-3  text-lg text-gray-700 hover:bg-gray-200 cursor-pointer rounded-lg"
            onClick={() => navigate(`/`)}
          >
            <img
              src="/images/sidebar/doctor.png"
              alt="Dashboard"
              className="w-10 h-6 mr-3 inline-block"
            />
            Bác sĩ
          </li>
          <li className="px-6 py-3 text-lg text-gray-700 hover:bg-gray-200 cursor-pointer rounded-lg">
            <img
              src="/images/sidebar/giaodich.png"
              alt="Dashboard"
              className="w-8 h-6 mr-3 inline-block"
            />
            Giao dịch
          </li>
          <li className="px-6 py-3 text-lg text-gray-700 hover:bg-gray-200 cursor-pointer rounded-lg">
            <img
              src="/images/sidebar/benhnhan.png"
              alt="Dashboard"
              className="w-8 h-6 mr-3 inline-block"
            />
            Bệnh nhân
          </li>
          <li className="px-6 py-3 text-lg text-gray-700 hover:bg-gray-200 cursor-pointer rounded-lg">
            <img
              src="/images/sidebar/yeucau.png"
              alt="Dashboard"
              className="w-8 h-6 mr-3 inline-block"
            />
            Yêu cầu
          </li>
        </ul>
        <hr className="mt-10" />
      </nav>
    </div>
  );
};

export default Sidebar;
