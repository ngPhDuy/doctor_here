import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/images/avt.png";

type CallNotificationProps = {
  incomingCall: boolean;
  setIncomingCall: any;
  currentCall: any | null;
  setCurrentCall: any;
};

const CallNotification: React.FC<CallNotificationProps> = ({
  incomingCall,
  setIncomingCall,
  currentCall,
  setCurrentCall,
}) => {
  const navigate = useNavigate();
  const [ptName, setPtName] = useState<string>("");
  const [ptAvatar, setPtAvatar] = useState<string>("");

  // Lấy dữ liệu bệnh nhân
  useEffect(() => {
    console.log("UseEffect currentCall:", currentCall);
    if (!currentCall) return; // Nếu không có cuộc gọi hiện tại, không làm gì cả
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/patient/detail/${
        currentCall.fromNumber
      }`
    ).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log("Patient data:", data);
          setPtName(data.Nguoi_dung.ho_va_ten || "Người gọi");
          setPtAvatar(data.Nguoi_dung.avt_url || null);
        });
      } else {
        console.error("Failed to fetch patient data");
      }
    });
  }, [currentCall]);
  console.log("Incoming call at Notification:", incomingCall);

  return (
    <div
      className={`fixed top-2 left-1/2 transform -translate-x-1/2 w-96 p-6 bg-[#0094FF] text-white rounded-2xl shadow-xl animate-pulse animate-infinite animate-ease-out animate-duration-1000 ${
        incomingCall ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-start items-center gap-2">
        <div className="flex items-center gap-3">
          <img
            src={ptAvatar || defaultAvatar}
            alt="Patient Avatar"
            className="w-16 h-16 rounded-full"
          />
        </div>
        <div>
          <p className="font-bold text-xl">{ptName || "Bệnh nhân"}</p>
          <p className="text-sm">Đang gọi đến...</p>
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2 text-sm">
        {/* Button Accept */}
        <button
          onClick={() => {
            if (currentCall) {
              console.log("Current call at Notification:", currentCall);
              // Chuyển hướng đến VideoCall khi người dùng nhấn "Trả lời"
              navigate(`/video_call/${currentCall.fromNumber}`); // Điều hướng đến trang VideoCall
              // currentCall.answer((res: any) => {
              //   console.log("Answer call:", res);
              // });
              // setIncomingCall(false);
            }
          }}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          Phóng to
        </button>
        <button
          onClick={() => {
            if (currentCall) {
              currentCall.reject((res: any) => {
                console.log("Reject call:", res);
              });
            }
            setIncomingCall(false); // Ẩn thông báo cuộc gọi đến
            setCurrentCall(null); // Đặt currentCall về null
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
        >
          Từ chối
        </button>
      </div>
    </div>
  );
};

export default CallNotification;
