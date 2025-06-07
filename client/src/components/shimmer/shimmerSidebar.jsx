import React from "react";

import { useSelector } from "react-redux";
function ShimmerSidebar() {
  const { selectedUser} = useSelector((state) => state.user);
  return (
    <div
      className={`w-full h-full lg:w-[30%] bg-slate-200 lg:block overflow-hidden ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      {/* Header shimmer */}
      <div className="w-full h-[300px] bg-purple-500 rounded-b-[25%] flex flex-col justify-center px-5 gap-4">
        <div className="h-6 bg-white/60 w-[120px] rounded-md animate-pulse"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-white/60 w-[150px] rounded-md animate-pulse"></div>
          <div className="w-[80px] h-[80px] rounded-full border-4 border-white bg-white/60 animate-pulse"></div>
        </div>
      </div>

      {/* Search icon shimmer */}
      <div className="w-full px-5 mt-5">
        <div className="w-[60px] h-[60px] rounded-full bg-white animate-pulse shadow-md"></div>
      </div>

      {/* User list shimmer */}
      <div className="w-full h-[55vh] overflow-auto flex flex-col gap-4 mt-6 px-3">
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-[60%] h-[16px] bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ShimmerSidebar;
