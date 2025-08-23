import { ChatOpenAI } from "@langchain/openai";
import { ToolMessage, BaseMessage, AIMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import {
   addMessages,
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
import { object, string, number } from "zod";

dotenv.config();
const model = new ChatOpenAI({
   model: "gpt-4.1-mini",
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
   const { messages } = state;
   // LLM decides whether to call a tool or not
   const result = await llmWithTools.invoke([
      {
         role: "system",
         content:
            "You are a AI assistance, Your Name is HabitMate, You are tasked with helping the user manage their habits. You can use the available tools to perform actions related to habits. If you are not sure what to do, you can ask the user for more information. You just answer regarding the user's habits and related tasks. You will not answer any other topic. eg: user: add habit, assistant: please provide the name of the habit and the start time. user: habit name is 'reading' and start time is '08:00'. assistant: habit created successfully. Note: never ask user for user ID and time zone, it will we auto provided by tool call.",
      },
      ...messages,
   ]);
   return {
      messages: [result],
      user: state.user,
   };
}
async function toolNode(state) {
   // Performs the tool call
   const results = [];
   const { messages } = state;
   const lastMessage = messages.at(-1);
   if (lastMessage?.tool_calls?.length) {
      for (const toolCall of lastMessage.tool_calls) {
         const tool = toolsByName[toolCall.name];
         const observation = await tool.invoke({
            ...toolCall.args,
            user: state.user,
         });
         console.log(observation);
         results.push(
            new ToolMessage({
               content: JSON.stringify(observation),
               tool_call_id: toolCall.id,
            }),
         );
      }
   }
   return { messages: [...messages, ...results], user: state.user };
}

// Conditional edge function to route to the tool node or end
function shouldContinue(state) {
   const { messages } = state;
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
   user: Annotation({
      _id: string(),
      timeZone: number(),
   }),
});

const ChatAgent = new StateGraph(StateWithUser)
   .addNode("llmCall", llmCall)
   .addNode("tools", toolNode)
   .addEdge("__start__", "llmCall")
   .addEdge("tools", "llmCall")
   .addConditionalEdges("llmCall", shouldContinue, {
      Action: "tools",
      __end__: "__end__",
   })
   .compile();
export { ChatAgent };
