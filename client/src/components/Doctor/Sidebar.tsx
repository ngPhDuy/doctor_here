import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import socket, {
  registerUser,
  sendMessage,
  onMessageReceived,
} from "../../socket";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let drID = localStorage.getItem("drID") || "BS0000001";
  const [isNewMessage, setNewMessage] = useState(false);

  // Danh sách các đường dẫn tương ứng với từng mục
  const dashBoardActive = ["/"];
  const calendarActive = ["/historyList", "/historyDetail"];
  const peopleActive = [
    "/patientListDoctor",
    "/patientInfoDoctor",
    "/patientDetailHistory",
  ];
  const mailActive = ["/conversations"];
  const uploadActive = ["/resultList", "/resultDetail"];
  const settingActive = [
    "/doctorSettingInfo",
    "/doctorRequest",
    "/doctorSchedule",
    "/doctorRating",
  ];

  useEffect(() => {
    registerUser(drID);

    if (location.pathname !== "/conversations") {
      onMessageReceived((data) => {
        console.log(data);
        setNewMessage(true);
      });
    }

    return () => {
      socket.off("chat_message");
    };
  }, [location.pathname]);

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
        // maxWidth: "180px",
        maxWidth: "10rem",
      }}
    >
      <nav className="">
        <ul
          className=""
          style={{
            paddingTop: "1rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
          }}
        >
          <li
            className={`sidebar-item psi py-3 flex text-sm font-semibold hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(dashBoardActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/`)}
          >
            <img
              src={
                isActive(dashBoardActive)
                  ? "/images/doctor_sidebar/dashboard_sel.png"
                  : "/images/doctor_sidebar/dashboard.png"
              }
              alt="Dashboard"
            />
            <span className="ml-2">Trang chủ</span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(calendarActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/historyList`)}
          >
            <img
              src={
                isActive(calendarActive)
                  ? "/images/doctor_sidebar/calendar_sel.png"
                  : "/images/doctor_sidebar/calendar.png"
              }
              alt="Calendar"
            />
            <span className="ml-2">Cuộc hẹn</span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(peopleActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/patientListDoctor`)}
          >
            <img
              src={
                isActive(peopleActive)
                  ? "/images/doctor_sidebar/bi_people_sel.png"
                  : "/images/doctor_sidebar/bi_people.png"
              }
              alt="People"
            />
            <span className="ml-2">Bệnh nhân</span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(mailActive) ? "active-color" : "default-color"
            }`}
            onClick={() => {
              setNewMessage(false);
              navigate(`/conversations`);
            }}
          >
            <img
              src={
                isActive(mailActive)
                  ? "/images/doctor_sidebar/mail_sel.png"
                  : "/images/doctor_sidebar/mail.png"
              }
              alt="People"
            />
            <span className="ml-2">Tin nhắn</span>
            {isNewMessage && (
              <span className="ml-2 bg-red-500 text-white rounded-full h-2 w-2 flex items-center justify-center text-sm font-semibold"></span>
            )}
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(uploadActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/resultList/pending`)}
          >
            <img
              src={
                isActive(uploadActive)
                  ? "/images/doctor_sidebar/upload_sel.png"
                  : "/images/doctor_sidebar/upload.png"
              }
              alt="Upload"
            />
            <span className="ml-2">KQ khám bệnh</span>
          </li>
          <li
            className={`psi py-3 text-sm font-semibold flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(settingActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/doctorSettingInfo`)}
          >
            <img
              src={
                isActive(settingActive)
                  ? "/images/doctor_sidebar/setting_sel.png"
                  : "/images/doctor_sidebar/setting.png"
              }
              alt="Upload"
            />
            <span className="ml-2">Cài đặt</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
