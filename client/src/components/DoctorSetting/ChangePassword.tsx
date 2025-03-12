import React, { useState } from "react";
import { PasswordInput } from "../Input/InputComponents";
import Swal from "sweetalert2";

const ChangePassword = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

type UpdateUserModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
  username: string;
};

const ChangePasswordModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  setIsOpen,
  username,
}) => {
  const [changePasswordData, setChangePasswordData] = useState(ChangePassword);

  const handleChange =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setChangePasswordData((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
    };

  const changePassword = async (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/account/change_password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, oldPassword, newPassword }),
        }
      );

      if (!response.ok) throw new Error("Không thể đổi mật khẩu.");

      const data = await response.json();

      await Swal.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công!",
        text: data.message || "Mật khẩu đã được cập nhật.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        width: "350px",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-lg",
          title: "text-base",
          confirmButton: "bg-blue-600 text-white px-4 py-2 rounded",
        },
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Đổi mật khẩu thất bại!",
        text: "Vui lòng kiểm tra lại thông tin và thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        width: "350px",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-lg",
          title: "text-base",
          confirmButton: "bg-red-600 text-white px-4 py-2 rounded",
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (
      changePasswordData.newPassword !==
      changePasswordData.confirmNewPassword
    ) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu không khớp",
        text: "Mật khẩu mới và xác nhận không giống nhau!",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
        width: "350px",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-lg",
          title: "text-base",
          confirmButton: "bg-yellow-500 text-white px-4 py-2 rounded",
        },
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận thay đổi mật khẩu?",
      text: "Bạn có chắc muốn đổi mật khẩu cho tài khoản này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      width: "350px",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-lg",
        title: "text-base",
        confirmButton: "bg-blue-600 text-white px-4 py-2 rounded mr-2",
        cancelButton: "bg-red-600 text-white px-4 py-2 rounded",
      },
    });

    if (result.isConfirmed) {
      setIsOpen();
      changePassword(
        username,
        changePasswordData.oldPassword,
        changePasswordData.newPassword
      );
    }
  };

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
            <span className="sr-only">Đóng</span>
          </button>
        </div>

        {/* Form nhập mật khẩu */}
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <PasswordInput
            label="Mật khẩu cũ"
            id="oldPassword"
            value={changePasswordData.oldPassword}
            onChange={handleChange("oldPassword")}
          />
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

        {/* Nút chỉnh sửa */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleSubmit}
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
