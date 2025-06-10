import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useSetCurrentUser from "./customHooks/getCurrentUser.js";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useSetOtherUsers from "./customHooks/getOtherUsers.js";
import ShimmerSidebar from "./components/shimmer/shimmerSidebar.jsx";
import MessageAreaShimmer from "./components/shimmer/shimmerMessageArea.jsx";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { serverURL } from "./main.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  setOnlineUsers,
  setSelectedUser,
  setSocket,
  updateSelectedUserLastSeen,
} from "./redux/userSlice.js";
function App() {
  useSetCurrentUser();
  const { userData, loading, socket, onlineUsers } = useSelector(
    (state) => state.user
  );
  let dispatch = useDispatch();
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
  }, [userData]);

  if (loading) {
    // Show some loading indicator while fetching user data
    return (
      <div className=" w-full h-[100vh] flex">
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
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
