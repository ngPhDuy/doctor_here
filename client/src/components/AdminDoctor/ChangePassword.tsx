import React, { useState } from "react";
import { PasswordInput } from "../Input/InputComponents";

const ChangePassword = {
  newPassword: "",
  confirmNewPassword: "",
};

type UpdateUserModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
  id: number;
};

const ChangePasswordModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  setIsOpen,
  id,
}) => {
  const [changePasswordData, setchangePasswordData] = useState(ChangePassword);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setchangePasswordData((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
    };

  const handleChangePassword = () => {};

  if (!isOpen) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-y-auto overflow-x-scroll bg-gray-800 bg-opacity-75"
    >
      <div className="relative w-full max-w-2xl max-h-full p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Thay đổi mật khẩu
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
          <PasswordInput
            label="Mật khẩu mới"
            id="newPassword"
            value={changePasswordData.newPassword}
            onChange={handleChange("newPassword")}
          />
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            id="confirmNewPassword"
            value={changePasswordData.confirmNewPassword}
            onChange={handleChange("confirmNewPassword")}
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setIsOpen();
            }}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg text-white bg-blueButton hover:bg-blueButtonHover"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
