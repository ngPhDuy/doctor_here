import React, { useState, useEffect, useRef } from "react";

type UpdateUserModalProps = {
  isOpen: boolean;
  toggleUpdatePasswordForm: () => void;
  id: string;
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

const UpdatePasswordModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  toggleUpdatePasswordForm,
  id,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBanned, setIsBanned] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  //   useEffect(() => {
  //     if (isOpen) {
  //       const fetchUserData = async () => {
  //         try {
  //           const response = await fetch(
  //             `${process.env.REACT_APP_API_URL}/users_by_id/${id}`
  //           );
  //           if (!response.ok) throw new Error("Failed to fetch user data");
  //           const data: User = await response.json();
  //           setUser(data);
  //           setIsBanned(data.is_banned);
  //         } catch (error) {
  //           console.error("Error fetching user data:", error);
  //         }
  //       };
  //       fetchUserData();
  //     }
  //   }, [isOpen, id]);

  //   const handleUpdate = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!user) return;

  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/admin/change_user_info`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //           credentials: "include",
  //           body: JSON.stringify({ id, ...user }),
  //         }
  //       );
  //       if (!response.ok) throw new Error("Failed to update user information");
  //       alert("Updated successfully");
  //       window.location.reload();
  //     } catch (error) {
  //       console.error("Error updating user information:", error);
  //     }
  //   };

  //   const handleChangePassword = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (newPassword !== confirmNewPassword) {
  //       alert("Password does not match");
  //       return;
  //     }
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/change_password`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //           credentials: "include",
  //           body: JSON.stringify({ id, password: newPassword }),
  //         }
  //       );
  //       if (!response.ok) throw new Error("Failed to update password");
  //       alert("Password updated successfully");
  //       setIsChangePassword(false);
  //     } catch (error) {
  //       console.error("Error updating password:", error);
  //     }
  //   };

  //   const handleFileSelect = () => fileInputRef.current?.click();

  //   const handleAvatarChange = async (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const file = event.target.files?.[0];
  //     if (!file || !file.type.startsWith("image/")) {
  //       alert("Only image files are allowed.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("file", file);
  //     try {
  //       const response = await fetch(
  //         `${process.env.REACT_APP_API_URL}/upload-avatar/${id}`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );
  //       if (!response.ok) throw new Error("Error uploading avatar");
  //       const data = await response.json();
  //       setUser((prev) => (prev ? { ...prev, avatar: data } : prev));
  //       window.location.reload();
  //     } catch (error) {
  //       console.error("Error updating avatar:", error);
  //     }
  //   };

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
            Change User Password
          </h3>
          <button
            type="button"
            onClick={() => setIsChangePassword(false)}
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
        <form action="#">
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="newpassword"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                New Password
              </label>
              <input
                type="password"
                name="newpassword"
                id="newpassword"
                value={newPassword}
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="confirmnewpassword"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmnewpassword"
                id="confirmnewpassword"
                value={confirmNewPassword}
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleChangePassword}
              className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
            >
              Change User Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
