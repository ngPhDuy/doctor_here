import React, { useState } from "react";
import {
  TextInput,
  SelectInput,
  TextAreaInput,
} from "../Input/InputComponents";

type AddDoctorModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

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

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pt-14 flex items-center justify-center w-full min-h-screen overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto mb-10 max-w-4xl p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
          <h3 className="text-lg font-semibold">Thêm bác sĩ</h3>
          <button
            type="button"
            onClick={setIsOpen}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <TextInput
            label="Email"
            id="email"
            value={doctorData.email}
            onChange={handleChange("email")}
          />
          <TextInput
            label="Mật khẩu"
            id="password"
            type="password"
            value={doctorData.password}
            onChange={handleChange("password")}
          />
          <TextInput
            label="Tên đăng nhập"
            id="username"
            value={doctorData.username}
            onChange={handleChange("username")}
          />
          <TextInput
            label="SĐT"
            id="phoneNumber"
            value={doctorData.phoneNumber}
            onChange={handleChange("phoneNumber")}
          />
          <TextInput
            label="Họ và tên"
            id="fullName"
            value={doctorData.fullName}
            onChange={handleChange("fullName")}
          />
          <TextInput
            label="Ngày sinh"
            id="birthday"
            type="date"
            value={doctorData.birthday}
            onChange={handleChange("birthday")}
          />
          <SelectInput
            label="Giới tính"
            id="gender"
            value={doctorData.gender}
            onChange={handleChange("gender")}
            options={[
              { value: "Male", label: "Nam" },
              { value: "Female", label: "Nữ" },
              { value: "None", label: "Khác" },
            ]}
          />
          <TextInput
            label="Thời điểm vào nghề"
            id="beginWorkDay"
            type="date"
            value={doctorData.beginWorkDay}
            onChange={handleChange("beginWorkDay")}
          />
          <TextInput
            label="Chuyên khoa"
            id="specialty"
            value={doctorData.specialty}
            onChange={handleChange("specialty")}
          />
          <TextInput
            label="Học vấn"
            id="degree"
            value={doctorData.degree}
            onChange={handleChange("degree")}
          />
        </div>
        <div className="grid gap-4 mb-4">
          <TextInput
            label="Địa chỉ phòng khám"
            id="address"
            value={doctorData.address}
            onChange={handleChange("address")}
          />
          <TextAreaInput
            label="Mô tả"
            id="description"
            value={doctorData.description}
            onChange={handleChange("description")}
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setDoctorData(Doctor);
              setIsOpen();
            }}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 rounded-lg"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
