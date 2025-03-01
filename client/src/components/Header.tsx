import React, { useState, useEffect } from "react";
import TooltipButton from "./TooltipButton";
import LoginComponent from "./Auth";
const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Đóng modal khi click bên ngoài
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
  return (
    <header className="min-h-16 w-full flex justify-between items-center border-b border-black-10 px-6 overflow-hidden py-4">
      <div className="flex items-center gap-4 ml-8">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="w-12 h-12 md:w-16 md:h-16 object-contain"
          onError={(e) => (e.currentTarget.src = "/images/default-logo.png")}
        />
        <h2 className="text-xl font-semibold text-gray-800 leading-none">Doctor Here</h2>
      </div>
      <div className="flex items-center space-x-3">
        <button type="button" id="logout" className="mr-8">
          <svg
            fill="#000000"
            className="w-6 h-6"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384.971 384.971"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <g id="Sign_Out">
                  {" "}
                  <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path>{" "}
                  <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path>{" "}
                </g>{" "}
                <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
              </g>{" "}
            </g>
          </svg>
        </button>
        <img
          src="/images/avt.png"
          alt="User Avatar"
          onClick={() => setShowLoginModal(true)}
          className="w-12 h-12 block items-center justify-center rounded-full mr-2"
        />

        <div>
          <p className="text-base text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Võ Tấn Tài
          </p>
          <p className="text-sm leading-none">Admin</p>{" "}
        </div>
      </div>
      <LoginComponent
        showModal={showLoginModal}
        toggleLoginModal={() => setShowLoginModal(false)}
        toggleRegisterModal={() => console.log("Chuyển sang đăng ký")}
      />
    </header>
  );
};

export default Header;
