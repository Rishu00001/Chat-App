import React, { useEffect } from "react";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useSetCurrentUser from "./customHooks/getCurrentUser";
import useSetOtherUsers from "./customHooks/getOtherUsers";
import { serverURL } from "./main";
import {
  setOnlineUsers,
  setSocket,
} from "./redux/userSlice";
import ShimmerSidebar from "./components/shimmer/shimmerSidebar";
import MessageAreaShimmer from "./components/shimmer/shimmerMessageArea";

function RootLayout() {
  useSetCurrentUser();
  useSetOtherUsers();

  const { userData, loading } = useSelector((state) => state.user);
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

    return () => socketio.disconnect();
  }, [userData, dispatch]);

  if (loading) {
    return window.location.pathname === "/" ? (
      <div className="w-full h-[100vh] flex">
        <ShimmerSidebar />
        <MessageAreaShimmer />
      </div>
    ) : (
      <div className="text-blue-900">Loading...</div>
    );
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-center" />
    </>
  );
}

export default App;
