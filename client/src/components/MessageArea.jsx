// MessageArea.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdKeyboardArrowLeft } from "react-icons/md";
import dp from "../assets/dp.webp";
import {
  setSelectedUser,
  updateSelectedUserLastSeen,
  setTypingStatus
} from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverURL } from "../main";
import { setMessages } from "../redux/messageSlice";
import MessageAreaShimmer from "./shimmer/shimmerMessageArea";

function MessageArea() {
  const {
    selectedUser,
    userData,
    socket,
    loading,
    onlineUsers,
    typingStatusMap
  } = useSelector((state) => state.user);
  const { messages = [] } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const image = useRef();

  const onEmojiClick = ({ emoji }) => {
    setInput((prevInput) => prevInput + emoji);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim().length === 0 && !backendImage) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: userData._id,
      message: input,
      image: frontendImage,
      createdAt: Date.now()
    };

    dispatch(setMessages([...messages, tempMessage]));
    setFrontendImage(null);
    try {
      const formData = new FormData();
      formData.append("message", input);
      setInput("");
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverURL}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessages([...messages, res.data]));
    } catch (err) {
      console.error("Send message error:", err);
    }
    setInput("");
    setBackendImage(null);
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (mess) => {
      dispatch(setMessages([...messages, mess]));
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, messages]);

  useEffect(() => {
    if (!socket) return;
    const handleLastSeenUpdate = ({ userId, lastseen }) => {
      dispatch(updateSelectedUserLastSeen({ userId, lastseen }));
    };
    socket.on("userLastSeenUpdated", handleLastSeenUpdate);
    return () => {
      socket.off("userLastSeenUpdated", handleLastSeenUpdate);
    };
  }, [socket, dispatch]);

  const lastseen = () => {
    if (!onlineUsers || !selectedUser) return "";

    if (onlineUsers.includes(selectedUser._id)) return "online";

    return selectedUser?.lastseen
      ? `last seen at ${new Date(selectedUser.lastseen).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }
        )}`
      : "offline";
  };

  if (loading) return <MessageAreaShimmer />;

  return (
    <div
      className={`w-full h-full lg:px-[10px] lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:block bg-slate-300 lg:border-l-2 lg:border-gray-300 overflow-hidden`}
    >
      {selectedUser ? (
        <div className="flex flex-col w-full h-100vh">
          {/* Header */}
          <div className="w-full h-[80px] lg:h-[100px] bg-purple-600 rounded-b-[30px] flex shadow-md px-[10px] md:px-[20px] items-center gap-[14px] lg:gap-[20px] sticky top-0 z-50">
            <div
              className="cursor-pointer hover:shadow-md hover:scale-105 transition duration-200"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <MdKeyboardArrowLeft className="w-8 h-8 text-white" />
            </div>
            <div className="relative w-[50px] h-[50px] rounded-full hover:shadow-md transition duration-200 cursor-pointer bg-slate-100">
              <img
                src={selectedUser?.image || dp}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-white font-semibold text-[18px]">
              <div className="flex flex-col">
                {selectedUser?.name}
                <span className="text-sm text-zinc-300">
                  {selectedUser &&
                  typingStatusMap?.[selectedUser._id] &&
                  selectedUser._id !== userData._id
                    ? ` typing...`
                    : lastseen()}
                </span>
              </div>
            </h1>
          </div>

          {/* Messages */}
          <div className="w-full h-[80%] lg:h-[76dvh] flex flex-col py-[30px] px-[20px] overflow-auto gap-[15px]">
            {showPicker && (
              <div className="absolute bottom-[80px] left-[20px] z-[100]">
                <EmojiPicker
                  width={225}
                  height={325}
                  onEmojiClick={onEmojiClick}
                  className="shadow-md"
                />
              </div>
            )}

            {Array.isArray(messages) &&
              messages.map((mess) =>
                mess.sender === userData._id ||
                mess.sender?._id === userData._id ? (
                  <SenderMessage
                    key={mess._id}
                    image={mess.image}
                    message={mess.message}
                    time={new Date(mess.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}
                  />
                ) : (
                  <ReceiverMessage
                    key={mess._id}
                    image={mess.image}
                    message={mess.message}
                    time={new Date(mess.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    })}
                  />
                )
              )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-gray-400 font-bold text-[50px]">
            Welcome to weChat
          </h1>
          <span className="text-gray-400">Chats will appear here.</span>
        </div>
      )}

      {/* Input */}
      {selectedUser && (
        <div className="w-full lg:w-[70%] h-[60px] fixed bottom-[20px] flex items-center justify-center">
          {frontendImage && (
            <img
              src={frontendImage}
              className="absolute w-[80px] right-[20%] bottom-[100px] rounded-lg shadow-lg"
              alt="preview"
            />
          )}
          <form
            className="w-[95%] lg:w-[70%] bg-purple-600 h-[60px] rounded-full shadow-lg flex items-center gap-[20px] px-[20px]"
            onSubmit={handleSendMessage}
          >
            <div
              onClick={() => setShowPicker((prev) => !prev)}
              className="hover:shadow-sm hover:scale-105 transition duration-200 cursor-pointer"
            >
              <RiEmojiStickerLine className="w-[20px] h-[20px] text-white" />
            </div>
            <input
              type="file"
              hidden
              accept="image/*"
              ref={image}
              onChange={handleImage}
            />
            <input
              type="text"
              value={input}
              className="w-full h-full bg-transparent outline-none text-white"
              placeholder="Message"
              onChange={(e) => {
                setInput(e.target.value);
                if (socket && selectedUser?._id) {
                  socket.emit("typing", { receiverId: selectedUser._id });
                }
              }}
            />
            <div
              onClick={() => image.current.click()}
              className="hover:shadow-sm hover:scale-105 transition duration-200 cursor-pointer"
            >
              <FaImages className="w-[20px] h-[20px] text-white" />
            </div>
            <button
              type="submit"
              className="hover:shadow-md hover:scale-105 transition duration-200"
            >
              <IoIosSend
                className={`w-[20px] h-[20px] ${
                  input || frontendImage ? "text-white" : "text-gray-400"
                }`}
              />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
