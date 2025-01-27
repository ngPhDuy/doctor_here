import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorInfo: React.FC = () => {
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState({
    experience: "10 năm",
    address: "123 Đường ABC, TP.HCM",
    education: "Đại học Y Dược TP.HCM",
    specialty: "Tim mạch",
    description: "Bác sĩ chuyên khoa tim mạch với hơn 10 năm kinh nghiệm.",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorDetails({ ...doctorDetails, [name]: value });
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md">
        <div className="p-3 cursor-pointer" onClick={() => navigate("/auth")}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
        <div className="p-3 mr-5 text-blue-500 cursor-pointer">
          <p className="font-semibold text-xl mb-2">Thông tin chi tiết</p>
          <hr className="border-t-2 border-blue-500" />
        </div>
        <div className="p-3 cursor-pointer">
          <p className="font-semibold text-xl mb-2">Yêu cầu cập nhật</p>
        </div>
      </div>
      <div className="flex gap-8">
        {/* Thông tin chuyên ngành bên trái */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Chi tiết bác sĩ</h2>
          <div className="space-y-4">
            {Object.entries(doctorDetails).map(([key, value]) => (
              <div key={key}>
                <label className="block font-medium capitalize">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 mr-3  bg-yellow-400 text-white rounded-lg"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Lưu" : "Chỉnh sửa"}
            </button>
            <button className="px-4 py-2 mr-3  bg-blue-400 text-white rounded-lg">
              Đặt lại mật khẩu
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
              Khóa tài khoản
            </button>
          </div>
        </div>
        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <img
            src="/images/doctor-avatar.png"
            alt="Doctor Avatar"
            className="w-40 h-40 rounded-full mb-4"
          />
          <p className="text-xl font-semibold">Bác sĩ Nguyễn Văn A</p>
          <p className="text-gray-600">Chuyên khoa: Nội tổng quát</p>
          <p className="text-gray-600">Email: doctorA@example.com</p>
          <p className="text-gray-600">Số điện thoại: 0123 456 789</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
