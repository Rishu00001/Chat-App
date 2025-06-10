import React, { useState, useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";
function Profile() {
  let navigate = useNavigate();
  let { userData, loading } = useSelector((state) => state.user);

  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  let image = useRef();
  let [saving, setSaving] = useState(false);
  let dispatch = useDispatch();

  // Sync local state when userData changes (important!)
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setFrontendImage(userData.image || dp);
    }
  }, [userData]);

  if (loading) return <h1>Loading...</h1>;

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    setSaving(true);
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.put(`${serverURL}/api/user/profile`, formData, {
        withCredentials: true,
      });
      setSaving(false);
      dispatch(setUserData(result.data));
       toast.success("Your profile was updated!");
    } catch (error) {
      console.log(error);
      setSaving(false);
       toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-200 flex items-center justify-center px-4">
      <div
        className="fixed top-5 left-5 rounded-full border-2 border-gray-300 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center w-14 h-14"
        onClick={() => {
          navigate("/");
        }}
      >
        <MdKeyboardArrowLeft className="w-8 h-8 text-gray-600 hover:text-black transition-colors duration-200" />
      </div>

      <div className="w-full max-w-md bg-transparent rounded-lg flex flex-col gap-6 pb-6 overflow-hidden">
        {/* Header */}
        <div className="w-full h-40 bg-transparent rounded-b-[25%] flex flex-col items-center justify-center shadow-md relative">
          <div
            className="relative w-[100px] h-[100px]"
            onClick={() => {
              image.current.click();
            }}
          >
            <img
              src={frontendImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-purple-300"
            />
            {/* Camera icon on top edge */}
            <IoCameraOutline className="absolute bottom-2 right-1 bg-white rounded-full p-1 w-6 h-6 text-gray-800 shadow z-10" />
          </div>
          <h2 className="text-white font-semibold mt-2 text-xl">
            <p className="text-zinc-400 font-semibold">{userData?.username}</p>
          </h2>
        </div>

        {/* Form */}
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
          {/* Name Field */}
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

          {/* Username Field */}
          <div className="flex flex-col gap-1">
            <input
              name="username"
              type="text"
              value={userData?.username}
              readOnly
              className="w-full h-12 border border-purple-300 px-4 py-2 rounded-md bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Email Field */}
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
            className="mt-2 w-full py-3 bg-purple-600 text-white font-medium text-sm rounded-md hover:bg-purple-700 transition duration-200"
            disabled={saving}
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
