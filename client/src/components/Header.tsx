import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsRobot } from "react-icons/bs";
import TooltipButton from "./TooltipButton";
import defaultAvatar from "../assets/images/avt.png";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const avtUrl: string = localStorage.getItem("avtUrl") || "";

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (showLoginModal) {
        const modalElement = document.getElementById("login-modal");
        if (modalElement && !modalElement.contains(event.target as Node)) {
          setShowLoginModal(false);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showLoginModal]);

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("id");
          localStorage.removeItem("avtUrl");
          localStorage.removeItem("fullName");
          setIsLoggedIn(false);
          window.location.href = "/login";
        } else {
          console.error("Logout failed:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <header>
      <div className="flex justify-between items-center px-2">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Logo" className="w-14 h-14" />
          <h2 className="text-lg font-semibold text-gray-800 ml-2">Doctor Here</h2>
        </div>

        {/* Right Section */}
        <div className="flex gap-4 items-center">
          {/* Trợ lý ảo */}
          <TooltipButton text="Trợ lý ảo">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => navigate("/conversations")}
            >
              <BsRobot className="w-6 h-6 text-gray-700" />
            </button>
          </TooltipButton>

          {/* Logout */}
          <TooltipButton text="Đăng xuất">
            <button type="button" id="logout" onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                fill="#000000"
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384.971 384.971"
              >
                <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z" />
                <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z" />
              </svg>
            </button>
          </TooltipButton>

          {/* Avatar và Info */}
          <img
            src={avtUrl === "" ? defaultAvatar : avtUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              {localStorage.getItem("fullName") ?? "Nguyễn Văn A"}
            </p>
            <p className="text-sm">{role === "qtv" ? "Quản trị viên" : "Bác sĩ"}</p>
          </div>
        </div>
      </div>
      <hr />
    </header>
  );
};

export default Header;
