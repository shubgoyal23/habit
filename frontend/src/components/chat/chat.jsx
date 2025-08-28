import {
   CardTitle,
   CardHeader,
   CardContent,
   Card,
   CardDescription,
} from "@/components/ui/card";
import MessageList from "./messageList";
import MessageInput from "./messageInput";
import { useState } from "react";
import axios from "axios";
import { conf } from "@/conf/conf";

export default function Chat() {
   const [messageList, setMessageList] = useState([]);

   const sendMessage = (data) => {
      const message = { role: "user", content: data };
      setMessageList([...messageList, message]);

      const chatreq = axios.post(
         `${conf.BACKEND_URL}/api/v1/chat/`,
         { message: [...messageList, message] },
         {
            withCredentials: true,
         }
      );
      chatreq
         .then((data) => {
            setMessageList(data.data.data.message);
         })
         .catch((err) => console.log(err));
   };

   return (
      <div className="w-full h-[calc(100svh-80px)] flex justify-center items-center">
         <Card className="pt-10 md:pt-6 mx-auto h-full max-w-sm w-full flex flex-col m-0">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold">HabitMate</CardTitle>
               <CardDescription>
                  Your smart companion for building better habits, effortlessly!
               </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-1 w-full h-full overflow-hidden">
               <MessageList messageList={messageList} />
               <MessageInput sendMessage={sendMessage} />
            </CardContent>
         </Card>
      </div>
   );
}
