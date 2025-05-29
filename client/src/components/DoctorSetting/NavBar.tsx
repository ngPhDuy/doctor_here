import React from "react";
import { useNavigate } from "react-router-dom";

//curPage = "profile" | "rating" | "request" | "schedule" | "accessSetting"
interface NavBarProps {
  curPage: string;
}

const NavBar: React.FC<NavBarProps> = ({ curPage }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-md text-base">
      <div className="p-3 cursor-pointer" onClick={() => navigate(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.57 5.92969L3.5 11.9997L9.57 18.0697"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.5 12H3.67001"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className={`mr-5 cursor-pointer ${
          curPage === "profile" ? "text-blueTitle" : ""
        }`}
        onClick={() => navigate("/doctorSettingInfo")}
      >
        <p className="font-semibold  mb-1 ml-1">Cá nhân</p>
        {curPage === "profile" && (
          <hr className="border-t-2 border-blueTitle ml-1" />
        )}
      </div>
      <div
        className={`mr-5 cursor-pointer ${
          curPage === "rating" ? "text-blueTitle" : ""
        }`}
        onClick={() => navigate("/doctorRating")}
      >
        <p className="font-semibold  mb-1">Các đánh giá</p>
        {curPage === "rating" && (
          <hr className="border-t-2 border-blueTitle ml-1" />
        )}
      </div>
      <div
        className={`mr-5 cursor-pointer ${
          curPage === "request" ? "text-blueTitle" : ""
        }`}
        onClick={() => navigate("/doctorRequest")}
      >
        <p className="font-semibold  mb-1">Các yêu cầu cập nhật</p>
        {curPage === "request" && (
          <hr className="border-t-2 border-blueTitle ml-1" />
        )}
      </div>
      <div
        className={`mr-5 cursor-pointer ${
          curPage === "schedule" ? "text-blueTitle" : ""
        }`}
        onClick={() => navigate("/doctorSchedule")}
      >
        <p className="font-semibold  mb-1">Lịch làm việc</p>
        {curPage === "schedule" && (
          <hr className="border-t-2 border-blueTitle ml-1" />
        )}
      </div>
      <div
        className={`mr-5 cursor-pointer ${
          curPage === "accessSetting" ? "text-blueTitle" : ""
        }`}
        onClick={() => navigate("/resultAccessSetting")}
      >
        <p className="font-semibold  mb-1">Chia sẻ kết quả khám</p>
        {curPage === "accessSetting" && (
          <hr className="border-t-2 border-blueTitle ml-1" />
        )}
      </div>
    </div>
  );
};

export default NavBar;
