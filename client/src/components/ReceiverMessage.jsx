import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.webp";
function ReceiverMessage({ message, image }) {
  let scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behaviour: "smooth" });
  }, [message, image]);
   const handleImageScroll = ()=>{
    scroll.current.scrollIntoView({ behaviour: "smooth" });
  }
  return (
    <div
      className="w-fit h-fit max-w-[500px] bg-blue-400 px-[20px] py-[10px] text-white
     rounded-tl-none rounded-2xl left-0 relative shadow-gray-500 shadow-lg gap-[10px] flex flex-col"
    >
      <div ref={scroll}>
        {image && <img src={image} className="w-[100px] rounded-lg" onLoad={handleImageScroll}/>}
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}

export default ReceiverMessage;
