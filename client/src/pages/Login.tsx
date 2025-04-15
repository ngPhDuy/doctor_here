import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginComponentProps {
  setRole: (role: string) => void; // Định nghĩa props nhận hàm setRole
}

const LoginComponent: React.FC<LoginComponentProps> = ({ setRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.id);
        localStorage.setItem("avtUrl", data.avtUrl);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("role", data.role);

        setRole(data.role); // Cập nhật state role từ props

        if (data.token && data.role === "qtv") {
          navigate("/");
        } else if (data.token && data.role === "bs") {
          navigate("/");
        } else {
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-200">
      <div className="w-full max-w-lg bg-red-50 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mt-4">
          <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
        </div>
        <div className="flex justify-center">
          <h3 className="text-xl font-semibold text-gray-800 text-center">
            Doctor Here
          </h3>
        </div>
        <form className="space-y-6 mt-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-base font-medium text-blue-400"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="bg-red-50 border border-gray-400 text-gray-800 text-base rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-3"
              placeholder="Nhập tên đăng nhập"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-base font-medium text-blue-400"
            >
              Mật khẩu
            </label>
            <div className="flex justify-between bg-red-50 border border-gray-400 text-gray-800 text-base rounded-lg focus:ring-blue-400 focus:border-blue-400 w-full p-3">
              <input
                className="bg-red-50 text-gray-800 focus:outline-none w-full h-full text-base rounded-lg focus:ring-blue-400 focus:border-blue-400"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
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
                className="ml-2 text-base font-medium text-gray-800"
              >
                Nhớ mật khẩu
              </label>
            </div>
            <a href="#" className="text-base text-blue-400 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <button
            type="submit"
            className="w-full text-base text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-3"
          >
            Đăng nhập
          </button>
          <div className="text-base font-semibold text-gray-600 mt-4 text-center">
            Hãy liên hệ với hệ thống để đăng ký hợp tác.
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
