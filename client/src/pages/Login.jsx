import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../main";
import { useDispatch } from "react-redux";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { CgSpinner } from "react-icons/cg";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLogginIn] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLogginIn(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result?.data?.user));
      dispatch(setSelectedUser(null));
      setPassword("");
      setError("");
      setEmail("");
      setLogginIn(false);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
      setLogginIn(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col gap-6 pb-6 overflow-hidden">
        {/* Header */}
        <div className="w-full h-40 bg-purple-500 rounded-b-[25%] flex items-center justify-center shadow-md">
          <h1 className="text-gray-100 font-bold text-xl sm:text-2xl text-center">
            Login to <br />
            <span className="text-white text-3xl sm:text-4xl">weChat</span>
          </h1>
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 px-5 mt-4"
          onSubmit={handleLogin}
        >
          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <input
              name="email"
              type="email"
              value={email}
              placeholder="Email"
              required
              className="w-full h-12 border border-purple-300 px-4 py-2 rounded-md outline-none bg-white text-sm focus:ring-2 focus:ring-purple-400 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="h-5 text-xs text-red-600 font-medium ml-[8px]">
              {error.toLowerCase().includes("user") ? error : ""}
            </p>
          </div>

          {/* Password Field */}
          <div className="relative flex flex-col gap-1">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              required
              className="w-full h-12 border border-purple-300 px-4 py-2 rounded-md outline-none bg-white text-sm focus:ring-2 focus:ring-purple-400 transition pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? (
                <FaEye className="w-5 h-5" />
              ) : (
                <FaEyeSlash className="w-5 h-5" />
              )}
            </div>
            <p className="h-5 text-xs text-red-600 font-medium ml-[8px]">
              {error.toLowerCase().includes("password") ? error : ""}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full py-3 bg-purple-600 text-white font-medium text-sm rounded-md hover:bg-purple-700 transition duration-200"
          >
            {!loggingIn ? (
              "Log in"
            ) : (
              <>
                Logging in <CgSpinner className="animate-spin inline font-bold text-2xl" />
              </>
            )}
          </button>
        </form>

        {/* General Error Message (Bottom) */}
        <div className="h-5 mt-1 text-center">
          {!error.toLowerCase().includes("user") &&
            !error.toLowerCase().includes("password") &&
            error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
        </div>

        {/* Optional Footer */}
        <p className="text-sm text-center text-gray-500 mt-2">
          Don't have an account?{" "}
          <span
            className="text-purple-600 font-medium cursor-pointer underline"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Create now
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
