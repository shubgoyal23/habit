import { ChatOpenAI } from "@langchain/openai";
import { ToolMessage } from "@langchain/core/messages";

import dotenv from "dotenv";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { tools } from "./tools.helpers.js";

dotenv.config();
// const model = new ChatOpenAI({ model: "deepseek/deepseek-r1-distill-llama-70b:free" });
// const model = new ChatOpenAI({ model: "qwen/qwen2.5-vl-72b-instruct:free" });
const model = new ChatOpenAI({
   model: "google/gemini-2.0-flash-lite-preview-02-05:free",
});

// const llmWithTools = model.bindTools([create]);
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = model.bindTools(tools);

async function llmCall(state) {
   // LLM decides whether to call a tool or not
   const result = await llmWithTools.invoke([
      {
         role: "system",
         content:
            "You are a helpful assistant tasked with creating habit for user. you can create habit with just required feilds.",
      },
      ...state.messages,
   ]);

   return {
      messages: [result],
   };
}
async function toolNode(state) {
   // Performs the tool call
   const results = [];
   const lastMessage = state.messages.at(-1);

   if (lastMessage?.tool_calls?.length) {
      for (const toolCall of lastMessage.tool_calls) {
         const tool = toolsByName[toolCall.name];
         const observation = await tool.invoke(toolCall.args);
         results.push(
            new ToolMessage({
               content: observation,
               tool_call_id: toolCall.id,
            })
         );
      }
   }

   return { messages: results };
}

// Conditional edge function to route to the tool node or end
function shouldContinue(state) {
   const messages = state.messages;
   const lastMessage = messages.at(-1);

   // If the LLM makes a tool call, then perform an action
   if (lastMessage?.tool_calls?.length) {
      return "Action";
   }
   // Otherwise, we stop (reply to the user)
   return "__end__";
}

const ChatAgent = new StateGraph(MessagesAnnotation)
   .addNode("llmCall", llmCall)
   .addNode("tools", toolNode)
   // Add edges to connect nodes
   .addEdge("__start__", "llmCall")
   .addConditionalEdges("llmCall", shouldContinue, {
      // Name returned by shouldContinue : Name of next node to visit
      Action: "tools",
      __end__: "__end__",
   })
   .addEdge("tools", "llmCall")
   .compile();

export { ChatAgent };
