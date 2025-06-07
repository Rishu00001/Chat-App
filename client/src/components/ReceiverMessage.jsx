import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";

function ReceiverMessage({ message, image, time }) {
  const scroll = useRef();

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={scroll}
      className="w-fit h-fit max-w-[500px] bg-blue-400 px-[20px] py-[10px] text-white
     rounded-tl-none rounded-2xl left-0 relative shadow-gray-500 shadow-lg gap-[10px] flex flex-col"
    >
      {image && (
        <img
          src={image}
          alt="message image"
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

export default ReceiverMessage;
