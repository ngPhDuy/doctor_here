import React, { useState, useEffect, useRef } from "react";

type UpdateUserModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
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

const AddDoctorModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  setIsOpen,
  id,
}) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [first_name, setFisrtName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const [gender, setGender] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [isBanned, setIsBanned] = useState(false);
  //variable for update password
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");

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

  const handleUpdate = () => {};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-scroll overflow-x-scroll bg-gray-800 bg-opacity-75">
      <div className="w-full mt-auto sm:mt-20 max-w-2xl p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
          <h3 className="top-20 text-lg font-semibold text-gray-900">
            Update User
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
              htmlFor="firstname"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={first_name}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setFisrtName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={last_name}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Gender
            </label>
            <select
              id="gender"
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="birthday"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Birthday
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
        </div>

        <div className="grid gap-4 mb-4 sm:grid-cols-1">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Address
          </label>
          <textarea
            id="address"
            value={address}
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>

        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="phone_number"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone Number
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
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={username}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

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
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Role
            </label>
            <select
              id="role"
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleUpdate}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
          >
            Update User
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen();
              setIsChangePassword(true);
            }}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
          >
            Change User Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
