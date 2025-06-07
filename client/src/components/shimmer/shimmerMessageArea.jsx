import React from "react";
import { useSelector } from "react-redux";
function MessageAreaShimmer() {
  const { selectedUser} = useSelector((state) => state.user);
  return (
    <div
      className={`w-full h-[100vh] lg:px-[10px] lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:block bg-slate-300 lg:border-l-2 lg:border-gray-300 overflow-hidden`}
    >
      <div className="w-full h-[100px] bg-purple-600 rounded-b-[30px] flex items-center gap-4 px-[20px]">
        <div className="w-8 h-8 rounded-full bg-white/60 animate-pulse"></div>
        <div className="w-[50px] h-[50px] rounded-full bg-white/60 animate-pulse"></div>
        <div className="h-[20px] w-[120px] bg-white/60 rounded-md animate-pulse"></div>
      </div>
      <div className="w-full h-[calc(100%-100px)] flex flex-col justify-center items-center">
        <div className="w-[200px] h-[20px] bg-gray-300 rounded-md animate-pulse mb-2"></div>
        <div className="w-[160px] h-[16px] bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

export default MessageAreaShimmer;
