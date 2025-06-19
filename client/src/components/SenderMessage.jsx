import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
import { CiTimer } from "react-icons/ci";
import { useSelector } from "react-redux";

function SenderMessage({ image, message, time }) {
  const scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [image, message]);

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={scroll}
      className="w-fit h-fit max-w-[500px] bg-purple-600 px-[20px] py-[10px] text-white
      rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-gray-500 shadow-lg gap-[10px] flex flex-col"
    >
        {image && (
          <img
            src={image}
            className="w-[100px] rounded-lg"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
        {time && (
        <span className="text-[10px] text-white/70 self-end">{time}</span>
      )}
     
    </div>
  );
}

export default SenderMessage;
