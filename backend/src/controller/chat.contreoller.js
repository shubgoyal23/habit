import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { ChatAgent } from "../helpers/chat.helpers.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const chat = asyncHandler(async (req, res) => {
   const { message } = req.body;
   if (!message && message.length === 0) {
      return res.status(401).json(new ApiResponse(401, {}, "No message found"));
   }
   let messages = [];
   for (let m of message) {
      if (m.role === "user") {
         messages.push(new HumanMessage(m.content));
      } else if (m.role === "assistant") {
         messages.push(new AIMessage(m.content));
      }
   }
   const result = await ChatAgent.invoke({
      messages: messages,
      user: { _id: req.user._id, timeZone: req.user.timeZone },
   });
   const lastMessage = result.messages.at(-1);
   if (lastMessage instanceof AIMessage) {
      message.push({ role: "assistant", content: lastMessage.content });
   }

   return res
      .status(200)
      .json(new ApiResponse(200, { message: message }, "bot response"));
});

export { chat };
