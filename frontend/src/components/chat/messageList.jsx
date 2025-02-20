import React, { useEffect, useRef } from "react";

function MessageList({ messageList }) {
   const ref = useRef();

   useEffect(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
   }, [messageList]);

   return (
      <div className="flex-1 h-full">
         <div className="h-full overflow-y-scroll">
            {messageList.map((message, index) => (
               <div
                  key={index}
                  className={`w-full flex ${
                     message.role === "user" ? "justify-end" : "justify-start"
                  }`}
               >
                  <div
                     className={`w-3/4 m-1 p-2 rounded-md ${
                        message.role === "user"
                           ? "bg-violet-500 text-white"
                           : "bg-gray-200 text-black"
                     }`}
                  >
                     {message.content}
                  </div>
               </div>
            ))}
            <span ref={ref}></span>
         </div>
      </div>
   );
}

export default MessageList;
