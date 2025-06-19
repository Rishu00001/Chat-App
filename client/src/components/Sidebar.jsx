import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { serverURL } from "../main";
import { CgSpinner } from "react-icons/cg";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  let [search, setSearch] = useState(false);
  let [input, setInput] = useState("");
  let [loggingOut, setLoggingOut] = useState(false);
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      setLoggingOut(false);
      navigate("/login");
    } catch (error) {
      console.log("Error in logging out", error);
      setTimeout(() => {
        setLoggingOut(false);
      }, 1000);
    }
  };

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverURL}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result?.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input.trim()) {
      handleSearch();
    } else {
      dispatch(setSearchData([]));
    }
  }, [input]);

  return (
    <div
      className={`w-full h-[100%] lg:w-[30%] bg-slate-200 lg:block overflow-hidden ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      {/* Logout Button */}
      <div
        className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-600 shadow-lg mt-[20px] fixed bottom-[20px] left-[10px] bg-purple-500"
        onClick={handleLogout}
      >
        {!loggingOut ? (
          <BiLogOutCircle className="w-[20px] h-[20px] text-gray-700 cursor-pointer hover:text-gray-400 hover:w-[22px] hover:h-[22px]" />
        ) : (
          <CgSpinner className="animate-spin inline font-bold text-2xl" />
        )}
      </div>

      {/* Header */}
      <div className="w-full h-[300px] bg-purple-500 rounded-b-[25%] flex flex-col shadow-md justify-center px-[20px]">
        <h1 className="text-white font-bold text-[25px]">weChat</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-gray-800 font-bold text-[25px]">
            Hello, {userData?.name || "User"}
          </h1>
          <div
            className="relative w-[80px] h-[80px] rounded-full border-4 border-white hover:shadow-gray-700 hover:shadow-lg cursor-pointer bg-slate-100"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img
              src={userData?.image || dp}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Search Icon / Input */}
        <div className="w-full flex items-center gap-[20px]">
          {!search && (
            <div
              className="relative w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-600 shadow-lg bg-white mt-[20px]"
              onClick={() => {
                setSearch(true);
              }}
            >
              <IoSearch className="w-[20px] h-[20px] text-gray-500 cursor-pointer hover:text-gray-400 hover:w-[22px] hover:h-[22px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[60px] shadow-gray-600 shadow-lg bg-white flex items-center gap-[10px] mt-[20px] overflow-hidden rounded-full px-[20px] relative">
              <IoSearch className="w-[25px] h-[25px] text-gray-500" />
              <input
                type="text"
                value={input}
                placeholder="search people"
                className="w-full h-full border-0 outline-none"
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2
                className="w-[20px] h-[20px] text-gray-500 cursor-pointer"
                onClick={() => {
                  setSearch(false);
                  setInput("");
                  dispatch(setSearchData([]));
                }}
              />
            </form>
          )}

          {/* Avatar bubbles of online users */}
          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                    }}
                    className="relative rounded-full cursor-pointer"
                    key={user._id}
                  >
                    <div className="relative w-[60px] h-[60px] mt-[20px]">
                      <img
                        src={user?.image || dp}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full shadow-gray-700 shadow-lg bg-yellow-50"
                      />
                      <span className="absolute bottom-1 right-1 w-[10px] h-[10px] bg-[#0f0] rounded-full shadow-gray-800 shadow-md"></span>
                    </div>
                  </div>
                )
            )}
        </div>
      </div>

      {/* 🔁 Other users list (when no search input) */}
      {!input && (
        <div className="w-full h-[45%] overflow-auto flex flex-col items-center mt-[20px]">
          {otherUsers?.map((user) => (
            <div
              className="w-full h-[70px] bg-transparent flex items-center border-b-[1px] border-gray-300 hover:bg-slate-300 transition-colors duration-200 cursor-pointer pl-1 gap-2"
              onClick={() => {
                dispatch(setSelectedUser(user));
              }}
              key={user._id}
            >
              <div className="relative w-[60px] h-[60px] flex justify-center items-center">
                <img
                  src={user?.image || dp}
                  alt="Profile"
                  className="w-[50px] h-[50px] object-cover rounded-full"
                />
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute bottom-2 right-2 w-[10px] h-[10px] bg-[#0f0] rounded-full shadow-gray-800 shadow-md"></span>
                )}
              </div>
              <h1 className="text-gray-800 font-semibold text-[18px]">
                {user.name || "No Name"}
              </h1>
            </div>
          ))}
        </div>
      )}

      {/* 🔍 Searched results (only when input exists) */}
      {input && searchData?.length > 0 && (
        <div className="w-full h-[45%] overflow-auto flex flex-col items-center mt-[20px]">
          {searchData.map((user) => (
            <div
              className="w-full h-[70px] bg-transparent flex items-center border-b-[1px] border-gray-300 hover:bg-slate-300 transition-colors duration-200 cursor-pointer pl-1 gap-2"
              onClick={() => {
                dispatch(setSelectedUser(user));
              }}
              key={user._id}
            >
              <div className="relative w-[60px] h-[60px] flex justify-center items-center">
                <img
                  src={user?.image || dp}
                  alt="Profile"
                  className="w-[50px] h-[50px] object-cover rounded-full"
                />
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute bottom-2 right-2 w-[10px] h-[10px] bg-[#0f0] rounded-full shadow-gray-800 shadow-md"></span>
                )}
              </div>
              <h1 className="text-gray-800 font-semibold text-[18px]">
                {user.name || "No Name"}
              </h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
