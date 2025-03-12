import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

interface DoctorInfo {
  name: string;
  specialty: string;
}

type ScheduleType = {
  "Ca sáng": string[];
  "Ca trưa": string[];
  "Ca chiều": string[];
  "Ca tối": string[];
};

const DoctorSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState<ScheduleType>({
    "Ca sáng": ["Offline", "Offline", "Offline", "Offline", "Offline", "Online", ""],
    "Ca trưa": ["Online", "Online", "Online", "Online", "Online", "Online", ""],
    "Ca chiều": ["Offline", "Offline", "Offline", "Offline", "Offline", "Offline", ""],
    "Ca tối": ["Online", "Online", "Online", "Online", "Online", "Online", ""]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const setStatus = (shift: keyof ScheduleType, index: number, newStatus: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      newSchedule[shift][index] = newStatus;
      return newSchedule;
    });
  };

  return (
    <div className="h-full bg-gray-100 p-4">
      {/* Navigation bar */}
      <div className="flex items-center p-3 mb-4 bg-white rounded-lg shadow-md">
        <div className="p-3 cursor-pointer" onClick={() => navigate("/doctorList")}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9.57 5.92969L3.5 11.9997L9.57 18.0697" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.5 12H3.67001" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="mr-5 cursor-pointer">
          <p className="font-semibold text-lg mb-1 ml-1">Cá nhân</p>
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <p className="font-semibold text-lg mb-1">Các đánh giá</p>
        </div>
        <div className="ml-5 cursor-pointer" onClick={() => navigate("/")}>
          <p className="font-semibold text-lg mb-1">Các yêu cầu cập nhật</p>
        </div>
        <div className="ml-5 text-blueTitle cursor-pointer" onClick={() => navigate("/")}>
          <p className="font-semibold text-lg mb-1">Lịch làm việc</p>
          <hr className="border-t-2 border-blueTitle ml-1" />
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white p-8 pb-16 rounded-lg shadow-md">
        {/* Title with a wide padding */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center flex-1">Bảng thời gian làm việc</h2>
          {isEditing ? (
            <div>
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 bg-gray-200 text-black font-semibold rounded mr-2"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded"
              >
                Lưu
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {/* Work schedule table */}
        <table className="w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border p-3 text-center border-gray-400"> </th>
              <th className="border p-3 text-center border-gray-400">Thứ hai</th>
              <th className="border p-3 text-center border-gray-400">Thứ ba</th>
              <th className="border p-3 text-center border-gray-400">Thứ tư</th>
              <th className="border p-3 text-center border-gray-400">Thứ năm</th>
              <th className="border p-3 text-center border-gray-400">Thứ sáu</th>
              <th className="border p-3 text-center border-gray-400">Thứ bảy</th>
              <th className="border p-3 text-center border-gray-400">Chủ nhật</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedule).map(([shift, daysSchedule]) => (
              <tr key={shift}>
                <td className="border p-3 text-center font-medium border-gray-400">
                  {shift} <br />
                  {getTimeRange(shift)}
                </td>
                {daysSchedule.map((status, index) => (
                  <td key={index} className="border p-3 text-center font-medium relative border-gray-400">
                    {isEditing && index < 6 ? (
                      <div className="flex space-x-1 absolute bottom-0 right-0">
                        <button
                          onClick={() => setStatus(shift as keyof ScheduleType, index, "Online")}
                          className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setStatus(shift as keyof ScheduleType, index, "Offline")}
                          className="bg-red-500 text-white px-1 py-0.5 rounded text-xs"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setStatus(shift as keyof ScheduleType, index, "")}
                          className="bg-gray-500 text-white px-1 py-0.5 rounded text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                    <span
                      className={`${
                        status === "Online"
                          ? "text-blue-500"
                          : status === "Offline"
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {status || ""}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getTimeRange = (shift: string) => {
  switch (shift) {
    case "Ca sáng":
      return "07:00 - 11:00";
    case "Ca trưa":
      return "11:00 - 13:00";
    case "Ca chiều":
      return "13:00 - 17:00";
    case "Ca tối":
      return "17:00 - 19:00";
    default:
      return "";
  }
};

export default DoctorSchedule;