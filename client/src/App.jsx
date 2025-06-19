import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import useSetCurrentUser from "./customHooks/getCurrentUser.js";
import useSetOtherUsers from "./customHooks/getOtherUsers.js";

import ShimmerSidebar from "./components/shimmer/shimmerSidebar.jsx";
import MessageAreaShimmer from "./components/shimmer/shimmerMessageArea.jsx";

import "react-toastify/dist/ReactToastify.css";

import { serverURL } from "./main.jsx";

import {
  setOnlineUsers,
  setSelectedUser,
  setSocket,
  updateSelectedUserLastSeen,
  setTypingStatus,
} from "./redux/userSlice.js";

function App() {
  useSetCurrentUser();
  useSetOtherUsers();

  const { userData, loading, socket, onlineUsers, typingStatusMap } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData?._id) return;

    const socketio = io(`${serverURL}`, {
      query: { userId: userData._id },
    });

    dispatch(setSocket(socketio));

    socketio.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => socketio.close();
  }, [userData, dispatch]);

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex">
        <ShimmerSidebar />
        <MessageAreaShimmer />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/profile" />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
      <ToastContainer position="bottom-center"/>
    </>
  );
}

export default App;
