import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách các đường dẫn tương ứng với từng mục
  const dashBoardActive = ["/"];
  const calendarActive = ["/historyList", "/historyDetail"];
  const peopleActive = [
    "/patientListDoctor",
    "/patientInfoDoctor",
    "patientDetailHistory",
  ];
  const mailActive = ["/"];
  const uploadActive = ["/upload"];
  const settingActive = ["/doctorSettingInfo", "doctorRequest"];

  // Hàm kiểm tra đường dẫn có nằm trong danh sách không
  const isActive = (paths: string[]) => {
    // Trường hợp đặc biệt cho / để tránh nhầm lẫn với các mục khác
    console.log(location.pathname);
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
        maxWidth: "200px",
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
            className={`sidebar-item psi py-3 flex text-lg hover:bg-gray-200 cursor-pointer rounded-lg ${
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
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
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
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
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
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(mailActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/newRequests`)}
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
          </li>
          <li
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
              isActive(uploadActive) ? "active-color" : "default-color"
            }`}
            onClick={() => navigate(`/newRequests`)}
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
            className={`psi py-3 text-lg flex hover:bg-gray-200 cursor-pointer rounded-lg ${
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
