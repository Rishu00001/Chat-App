import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { CgSpinner } from "react-icons/cg";

function Login() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result?.data?.user));
      dispatch(setSelectedUser(null));
      setEmail("");
      setPassword("");
      setError("");
      setLoggingIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
      setLoggingIn(false);
    }
  };

  if (userData) return <Navigate to="/" />;

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-6 pb-8 relative">
        {/* Logo */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full p-3">
          <div className="text-purple-600 font-bold text-xl">💬</div>
        </div>

        {/* Header */}
        <div className="pt-16 text-center px-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back to <span className="text-purple-600">weChat</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Please login to continue chatting
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col gap-4 px-6"
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={email}
              placeholder="you@example.com"
              required
              className="w-full h-12 border border-gray-300 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="h-5 text-xs text-red-600 font-medium">
              {error.toLowerCase().includes("user") ? error : ""}
            </p>
          </div>

          {/* Password */}
          <div className="relative flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              required
              className="w-full h-12 border border-gray-300 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400 pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute top-9 right-3 text-gray-500 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? (
                <FaEye className="w-5 h-5" />
              ) : (
                <FaEyeSlash className="w-5 h-5" />
              )}
            </div>
            <p className="h-5 text-xs text-red-600 font-medium">
              {error.toLowerCase().includes("password") ? error : ""}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full py-3 bg-purple-600 text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition"
          >
            {!loggingIn ? (
              "Log in"
            ) : (
              <>
                Logging in{" "}
                <CgSpinner className="animate-spin inline text-xl ml-2" />
              </>
            )}
          </button>
        </form>

        {/* General Error */}
        <div className="h-5 text-center mt-1">
          {!error.toLowerCase().includes("user") &&
            !error.toLowerCase().includes("password") &&
            error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
