import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
function SenderMessage({ image, message }) {
  let scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behaviour: "smooth" });
  }, [image, message]);
  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behaviour: "smooth" });
  };
  return (
    <div
      className="w-fit h-fit max-w-[500px] bg-purple-600 px-[20px] py-[10px] text-white
    rounded-tr-none rounded-2xl relative right-0 ml-auto shadow-gray-500 shadow-lg gap-[10px] flex flex-col"
    >
      <div ref={scroll}>
        {image && (
          <img
            src={image}
            className="w-[100px] rounded-lg"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}

export default SenderMessage;
