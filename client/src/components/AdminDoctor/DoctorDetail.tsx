import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangeDoctorInforModal from "./ChangeDoctorInfor";
import ChangePasswordModal from "./ChangePassword";
import { TextInput, TextAreaInput } from "../Input/InputComponents";

const Doctor = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  birthday: "",
  beginWorkDay: "",
  gender: "",
  phoneNumber: "",
  address: "",
  degree: "",
  specialty: "",
  description: "",
};

const DoctorInfor: React.FC = () => {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState(Doctor);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setDoctorData((prevData) => ({ ...prevData, [field]: e.target.value }));
    };

  const [isChangeDoctorInfor, setIsChangeDoctorInfor] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const toggleChangeDoctorInfor = () => {
    setIsChangeDoctorInfor(!isChangeDoctorInfor);
  };

  const toggleChangePassword = () => {
    setIsChangePassword(!isChangePassword);
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md">
        <div className="p-3 cursor-pointer" onClick={() => navigate("/")}>
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
        <div className="p-3 mr-5 text-blueTitle cursor-pointer">
          <p className="font-semibold text-xl mb-2">Thông tin chi tiết</p>
          <hr className="border-t-2 border-blueTitle" />
        </div>
        <div className="p-3 cursor-pointer">
          <p className="font-semibold text-xl mb-2">Yêu cầu cập nhật</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Thông tin chuyên ngành bên trái */}
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-8">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="44"
                height="44"
                rx="7.5"
                fill="#3995C5"
              />
              <rect
                x="0.5"
                y="0.5"
                width="44"
                height="44"
                rx="7.5"
                stroke="white"
              />
              <path
                d="M22.5 17.7188V23.625"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M32.7148 18.6525V26.3475C32.7148 27.6075 32.0398 28.7775 30.9485 29.4188L24.266 33.2775C23.1748 33.9075 21.8248 33.9075 20.7223 33.2775L14.0398 29.4188C12.9485 28.7888 12.2735 27.6187 12.2735 26.3475V18.6525C12.2735 17.3925 12.9485 16.2225 14.0398 15.5812L20.7223 11.7225C21.8135 11.0925 23.1635 11.0925 24.266 11.7225L30.9485 15.5812C32.0398 16.2225 32.7148 17.3813 32.7148 18.6525Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.5 27.2246V27.3371"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h2 className="text-xl font-semibold ml-4">Chi tiết bác sĩ</h2>
          </div>

          <h3 className="text-xl font-semibold">Thông tin chuyên ngành</h3>
          <div className="grid gap-4 mb-4 sm:grid-cols-2 my-4">
            {[
              { id: "beginworkday", label: "Thời điểm vào nghề", type: "date" },
              { id: "address", label: "Địa chỉ phòng khám", type: "text" },
              { id: "degree", label: "Học vấn", type: "text" },
              { id: "specialty", label: "Chuyên khoa", type: "text" },
            ].map((input) => (
              <div key={input.id}>
                <TextInput
                  label={input.label}
                  id={input.id}
                  type={input.type}
                  value={doctorData[input.id as keyof typeof doctorData] || ""}
                  onChange={(e) => handleChange(input.id)(e)}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <TextAreaInput
              label="Mô tả"
              id="description"
              value={doctorData.description}
              onChange={handleChange("description")}
            />
          </div>

          <div className="flex justify-end mt-10 mb-20">
            <button
              className="px-4 py-2 mr-3 bg-blueButton hover:bg-blueButtonHover text-white rounded-lg"
              onClick={toggleChangeDoctorInfor}
            >
              Chỉnh sửa
            </button>
            <button
              className="px-4 py-2 mr-3 bg-yellowButton hover:bg-yellowButtonHover text-white rounded-lg"
              onClick={toggleChangePassword}
            >
              Đặt lại mật khẩu
            </button>
            <button className="px-4 py-2 bg-redButton hover:bg-redButtonHover text-white rounded-lg">
              Khóa tài khoản
            </button>
          </div>
        </div>

        {/* Thông tin cá nhân bên phải */}
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <img
              src="/images/avt.png"
              alt="Doctor Avatar"
              className="w-30 h-30 rounded-full mb-4"
            />
            <p className="text-xl font-semibold">Bác sĩ Nguyễn Văn A (5151)</p>
            <p className="text-gray-600">21 tuổi, Nam</p>
          </div>

          <hr className="mt-10 mb-3" />
          <div className="ml-5">
            {[
              { label: "Email", value: "tantaivo2003@gmail.com" },
              { label: "SĐT", value: "0364823693" },
              { label: "Ngày sinh", value: "27-01-2003" },
              { label: "Địa chỉ", value: "271/1 P1 Mỹ Tho, Tiền Giang" },
              { label: "Mở tài khoản lúc", value: "07:59 07-01-2025" },
            ].map((info) => (
              <div className="mb-3" key={info.label}>
                <p className="text-lg font-medium">{info.label}</p>
                <p className="text-lg font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChangeDoctorInforModal
        isOpen={isChangeDoctorInfor}
        setIsOpen={toggleChangeDoctorInfor}
        id={5}
      />
      <ChangePasswordModal
        isOpen={isChangePassword}
        setIsOpen={toggleChangePassword}
        id={5}
      />
    </div>
  );
};

export default DoctorInfor;
