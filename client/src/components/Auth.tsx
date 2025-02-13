import React from "react";
import { useState } from "react";
interface LoginProps {
  showModal: boolean;
  toggleLoginModal: () => void;
  toggleRegisterModal: () => void;
}

const LoginComponent: React.FC<LoginProps> = ({
  showModal,
  toggleLoginModal,
  toggleRegisterModal,
}) => {
  if (!showModal) return null;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-200 bg-opacity-80">
      <div className="relative p-6 w-full max-w-lg max-h-full bg-red-50 rounded-lg shadow-lg">
        <button
          onClick={toggleLoginModal}
          className="text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
        <div>
          <div className="justify-center flex items-center">
            <img src="/images/logo.png" alt="Logo" className="w-40 h-auto" />
          </div>
        </div>
        <div className="flex items-center justify-center p-4 border-b rounded-t border-gray-300">
          <h3 className="text-2xl font-semibold text-gray-800">Doctor Here</h3>
        </div>
        <div className="p-6">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-lg font-medium text-blue-400"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-red-50 border border-gray-400 text-gray-800 text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-3"
                placeholder="username123"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-medium text-blue-400"
              >
                Mật khẩu
              </label>
              <div className="flex justify-between bg-red-50 border border-gray-400 text-gray-800 text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400 w-full p-3">
                <input
                  className="bg-red-50 text-gray-800 focus:outline-none w-full h-full text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-700"
                    >
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-700"
                    >
                      <path
                        d="M2 2L22 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-5 h-5 border border-gray-400 rounded bg-gray-100 focus:ring-3 focus:ring-blue-300"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-lg font-medium text-gray-800"
                >
                  Nhớ mật khẩu
                </label>
              </div>
              <a href="#" className="text-lg text-blue-400 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-lg text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-3"
            >
              Login
            </button>
            <div className="text-lg font-semibold text-gray-600">
              Không có tài khoản?
              <a
                href="#"
                className="text-blue-400 hover:underline"
                onClick={toggleRegisterModal}
              >
                {" "}
                Đăng ký{" "}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
