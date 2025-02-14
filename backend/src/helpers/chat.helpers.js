import { ChatOpenAI } from "@langchain/openai";
import { ToolMessage } from "@langchain/core/messages";

import dotenv from "dotenv";
import {
   Annotation,
   MessagesAnnotation,
   StateGraph,
} from "@langchain/langgraph";
import {
   create,
   edit,
   deletehbt,
   addstrk,
   rmvstrk,
   listhbt,
   todayhbt,
   srchHabit,
} from "./tools.helpers.js";

dotenv.config();
const model = new ChatOpenAI({
   model: "google/gemini-2.0-pro-exp-02-05:free",
});

// const llmWithTools = model.bindTools([create]);
const tools = [
   create,
   edit,
   deletehbt,
   addstrk,
   rmvstrk,
   listhbt,
   todayhbt,
   srchHabit,
];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = model.bindTools(tools);

async function llmCall(state) {
   // LLM decides whether to call a tool or not
   const result = await llmWithTools.invoke([
      {
         role: "system",
         content:
            "You are a habit management assistant responsible for managing habits using available tools. Only ask for the details which are required to complete a task, you can skip optionals feilds.",
      },
      ...state.messages,
   ]);
   return {
      messages: [result],
      user: state.user,
   };
}
async function toolNode(state) {
   // Performs the tool call
   const results = [];
   const lastMessage = state.messages.at(-1);
   if (lastMessage?.tool_calls?.length) {
      for (const toolCall of lastMessage.tool_calls) {
         const tool = toolsByName[toolCall.name];
         const observation = await tool.invoke({
            ...toolCall.args,
            user: state.user,
         });
         results.push(
            new ToolMessage({
               content: observation,
               tool_call_id: toolCall.id,
            })
         );
      }
   }

   return { messages: results, user: state.user };
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

const StateWithUser = Annotation.Root({
   ...MessagesAnnotation.spec,
   user: Annotation,
});

const ChatAgent = new StateGraph(StateWithUser)
   .addNode("llmCall", llmCall)
   .addNode("tools", toolNode)
   .addEdge("__start__", "llmCall")
   .addConditionalEdges("llmCall", shouldContinue, {
      Action: "tools",
      __end__: "__end__",
   })
   .addEdge("tools", "llmCall")
   .compile();

export { ChatAgent };
