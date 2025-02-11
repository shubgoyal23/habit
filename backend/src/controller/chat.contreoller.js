import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { ChatAgent } from "../helpers/chat.helpers.js";
import { HumanMessage } from "@langchain/core/messages";

const chat = asyncHandler(async (req, res) => {
   const { message } = req.body;
   if (!message) {
      return res.status(401).json(new ApiResponse(401, {}, "No message found"));
   }
   const messages = [new HumanMessage({ content: message })];
   const result = await ChatAgent.invoke({ messages, user: req.user });
console.log(result)
   return res
      .status(200)
      .json(new ApiResponse(200, { message: result.messages }, "bot response"));
});

export { chat };
