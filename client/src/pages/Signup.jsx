import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { serverURL } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signingUp, setSigninUp] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSigninUp(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result?.data?.user));
      setError("");
      setEmail("");
      setPassword("");
      setUsername("");
      setSigninUp(false);
      toast.success("Account created successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Something went wrong");
      setSigninUp(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-6 pb-8 overflow-hidden relative">
        {/* Floating Logo */}
        <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-white rounded-full p-3">
          <div className="text-purple-600 font-bold text-xl">💬</div>
        </div>

        {/* Header */}
        <div className="pt-16 text-center px-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to <span className="text-purple-600">weChat</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign up and start chatting instantly
          </p>
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-4 px-6 mt-4"
          onSubmit={handleSignup}
        >
          {/* Username Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              type="text"
              value={username}
              placeholder="Your username"
              required
              className="w-full h-12 border border-gray-300 px-4 py-2 rounded-lg outline-none bg-white text-sm focus:ring-2 focus:ring-purple-400"
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="h-5 text-xs text-red-600 font-medium">
              {error.toLowerCase().includes("user") ? error : ""}
            </p>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={email}
              placeholder="you@example.com"
              required
              className="w-full h-12 border border-gray-300 px-4 py-2 rounded-lg outline-none bg-white text-sm focus:ring-2 focus:ring-purple-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="h-5 text-xs text-red-600 font-medium">
              {error.toLowerCase().includes("email") ? error : ""}
            </p>
          </div>

          {/* Password Field */}
          <div className="relative flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              required
              className="w-full h-12 border border-gray-300 px-4 py-2 rounded-lg outline-none bg-white text-sm focus:ring-2 focus:ring-purple-400 pr-10"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full py-3 bg-purple-600 text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition duration-200"
          >
            {!signingUp ? (
              "Create Account"
            ) : (
              <>
                Creating <CgSpinner className="animate-spin inline font-bold text-xl ml-2" />
              </>
            )}
          </button>
        </form>

        {/* General Error (Bottom) */}
        <div className="h-5 mt-1 text-center">
          {!error.toLowerCase().includes("user") &&
            !error.toLowerCase().includes("email") &&
            !error.toLowerCase().includes("password") &&
            error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <span
            className="text-purple-600 font-semibold cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;