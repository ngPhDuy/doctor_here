import React, { useState, useEffect, useRef } from "react";

type ChangeDoctorInforModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
  id: number;
};

type User = {
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  birthday: string;
  avatar: string;
  gender: string;
  phone_number: string;
  address: string;
  is_banned: boolean;
};

const ChangeDoctorInforModal: React.FC<ChangeDoctorInforModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [beginworkday, setBeginworkday] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [degree, setDegree] = useState("");
  const [description, setDescription] = useState("");
  const [participateTime, setParticipateTime] = useState("");
  const [role, setRole] = useState("");

  const handleUpdate = () => {};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-scroll overflow-x-scroll bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto sm:mt-20 max-w-4xl p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
          <h3 className="top-20 text-lg font-semibold text-gray-900">
            Chỉnh sửa thông tin bác sĩ
          </h3>
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
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="name"
              id="name"
              disabled
              value={username}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="fullname"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Họ và tên
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              disabled
              value={full_name}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              SĐT
            </label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={phone_number}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="birthday"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Ngày sinh
            </label>
            <input
              type="date"
              name="birthday"
              id="birthday"
              value={birthday}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Giới tính
            </label>
            <select
              id="gender"
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="None">Khác</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="beginworkday"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Thời điểm vào nghề
            </label>
            <input
              type="date"
              name="beginworkday"
              id="beginworkday"
              value={beginworkday}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setBeginworkday(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Địa chỉ phòng khám
            </label>
            <input
              id="address"
              value={address}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="degree"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Học vấn
            </label>
            <input
              type="text"
              name="degree"
              id="degree"
              value={degree}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-1">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="grid gap-4 mb-4 sm:grid-cols-4">
          <div>
            <label
              htmlFor="participateTime"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Ngày gia nhập
            </label>
            <input
              type="date"
              name="participateTime"
              id="participateTime"
              disabled
              value={participateTime}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
              onChange={(e) => setParticipateTime(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Trạng thái
            </label>
            <select
              id="role"
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Male">Admin</option>
              <option value="Female">Doctor</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="addBy"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Cập nhật bởi
            </label>
            <input
              type="text"
              name="addBy"
              id="addBy"
              disabled
              value={"Tan Tai"}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="participateTime"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Vào lúc
            </label>
            <input
              name="participateTime"
              id="participateTime"
              value={"23:59 " + participateTime}
              disabled
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-lg"
              onChange={(e) => setParticipateTime(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setIsOpen();
            }}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg text-white bg-blue-600 hover:bg-blue-800"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDoctorInforModal;
