import React, { useState, useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);

  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();

  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false); // 👉 spam protection

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFrontendImage(userData.image || dp);
    }
  }, [userData]);

  if (loading) return <h1>Loading...</h1>;

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();

    if (savingRef.current) return; 

    savingRef.current = true;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(`${serverURL}/api/user/profile`, formData, {
        withCredentials: true,
      });

      dispatch(setUserData(result.data));
      setTimeout(()=>{
        toast.success("Your profile was updated!",{autoClose : 2000});
      },2000)
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
        setTimeout(() => {
      savingRef.current = false;
      setSaving(false);
    }, 2000); 
    }
  };
  if(!userData) return <Navigate to = "/login"/>
  return (
    <div className="w-full min-h-[100dvh] bg-slate-200 flex items-center justify-center px-4">
      {/* Back Button */}
      <div
        className="fixed top-5 left-5 rounded-full border-2 border-gray-300 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center w-14 h-14"
        onClick={() => navigate("/")}
      >
        <MdKeyboardArrowLeft className="w-8 h-8 text-gray-600 hover:text-black transition-colors duration-200" />
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-transparent rounded-lg flex flex-col gap-6 pb-6 overflow-hidden">
        {/* Header */}
        <div className="w-full h-40 bg-gradient-to-r from-purple-500 to-purple-700 rounded-b-[25%] flex flex-col items-center justify-center shadow-lg relative">
          <div
            className="relative w-[100px] h-[100px] hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => image.current.click()}
          >
            <img
              src={frontendImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-[5px] border-white shadow-md"
            />
            <IoCameraOutline className="absolute bottom-2 right-1 bg-white rounded-full p-1 w-6 h-6 text-purple-700 shadow-md" />
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white tracking-wide">
            @{userData?.username}
          </h2>
        </div>

        {/* Profile Form */}
        <form
          className="w-full flex flex-col gap-4 px-5 mt-4"
          onSubmit={handleProfile}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={image}
            onChange={handleImage}
          />

          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <input
              name="name"
              type="text"
              value={name}
              placeholder="Name"
              required
              className="w-full h-12 border border-purple-300 px-4 py-2 rounded-md outline-none bg-white text-sm focus:ring-2 focus:ring-purple-400 transition"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Username (read-only) */}
          <div className="flex flex-col gap-1">
            <input
              name="username"
              type="text"
              value={userData?.username}
              readOnly
              className="w-full h-12 border border-purple-300 px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col gap-1">
            <input
              name="email"
              type="email"
              value={userData?.email}
              readOnly
              className="w-full h-12 border border-purple-300 px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className={`mt-2 w-full py-3 text-white font-medium text-sm rounded-md transition duration-200 ${
              saving
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 active:scale-95"
            }`}
          >
            {!saving ? (
              "Save profile"
            ) : (
              <>
                Saving <CgSpinner className="animate-spin inline font-bold text-2xl" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
