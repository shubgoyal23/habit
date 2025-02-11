import OpenAI from "openai";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import {
   Createhabit,
   EditHabit,
   DeleteHabit,
   AddStreak,
   RemoveStreak,
   ListHabit,
   ListStreak,
   GetSteakListAll,
   GetTodaysHabits,
   SearchHabitByName,
} from "../helpers/task.helpers.js";

dotenv.config();

const openai = new OpenAI({
   baseURL: process.env.OPENAI_BASE_URL,
   apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an AI Habit List Assistant with START, PLAN, ACTION, FUNCTION, and OUTPUT State. 
Wait for the user prompt and first PLAN using available tools. 
After Planning, Take action with appropriate tools and wait for Observation based on Action. 
Once you get the observations, return the AI response based on START prompt and observations. 

You can manage tasks by adding, viewing, updating, and deleting them. 
You must strictly follow the JSON output format and output array of json in seires if you can do multiple at once, but rember to output correct json format.
and always output array of json if there is one output or many.

Habit MongoDB Schema: 
{
    "name": {
        "description": "The name of the habit.",
        "type": "String",
        "required": true
    },
    "description": {
        "description": "A brief description of what the habit entails.",
        "type": "String",
        "required": false
    },
    "duration": {
        "description": "The duration for which the habit should be performed.",
        "type": "String",
        "required": false
    },
    "startTime": {
        "description": "The start time of the habit on a specific day, represented in epoch time.",
        "type": "Number",
        "required": true
    },
    "endTime": {
        "description": "The end time of the habit on a specific day, represented in epoch time.",
        "type": "Number",
        "required": true
    },
    "startDate": {
        "description": "The start date of the habit, represented in epoch time at the start of the day (00:00).",
        "type": "Number",
        "required": true
    },
    "endDate": {
        "description": "The end date of the habit, represented in epoch time at the end of the day (23:59).",
        "type": "Number",
        "required": true
    },
    "repeat": {
        "description": "Specifies how the habit repeats.",
        "type": "Object",
        "fields": {
            "name": {
                "description": "The type of repetition (e.g., days, dates, hours, todo).",
                "type": "String",
                "enum": [
                    "days",
                    "dates",
                    "hours",
                    "todo"
                ],
                "required": true
            },
            "value": {
                "description": "Specific values for repetition (e.g., days of the week, specific dates).",
                "type": "Array",
                "items": {
                    "type": "Number"
                },
                "required": true
            }
        },
        "required": true
    },
    "place": {
        "description": "The location where the habit is to be performed.",
        "type": "String",
        "required": false
    },
    "how": {
        "description": "Instructions or methods on how to perform the habit.",
        "type": "String",
        "required": false
    },
    "ifthen": {
        "description": "Conditional statements that define actions based on habit completion.",
        "type": "String",
        "required": false
    },
    "point": {
        "description": "Points awarded for completing the habit.",
        "type": "Number",
        "required": false
    },
    "steak": {
        "description": "The number of consecutive days the habit has been completed.",
        "type": "Number",
        "required": false
    },
    "notify": {
        "description": "Whether notifications should be sent for the habit.",
        "type": "Boolean",
        "required": true
    },
    "isActive": {
        "description": "Indicates if the habit is currently active.",
        "type": "Boolean",
        "required": true
    },
    "habitType": {
        "description": "The type of habit (e.g., regular, negative, todo).",
        "type": "String",
        "enum": [
            "regular",
            "negative",
            "todo"
        ],
        "default": "regular",
        "required": true
    }
}

Available Tools: 
- Createhabit({}): Creates a new Habit in the DB and takes Habit and other items as a object
- EditHabit({}): Edits a Habit in the DB it also needs habit id and other items as a object
- DeleteHabit({}): Deletes a Habit in the DB, it needs habit id as a object
- AddStreak({}): Adds a new streak in the DB and takes habit id
- RemoveStreak({}): Removes a Streak in the DB and takes habit id
- ListHabit({}): Returns all the Habits of user from Database
- ListStreak({}): Returns all the Streaks of user from Database
- GetSteakListAll({}): Returns all the Streaks of user from Database
- GetTodaysHabits({}): Returns all the Habits of user due today from Database
- SearchHabitByName({}): Searches for a Habits matching the query string using regex


Example: 
START  
{"type": "user", "user": "I want to create a habit for meditaion" }
{"type": "plan", "plan": "I will try to get more context on Habit, like how often it should repeat, and when to start this habit." } 
{"type": "output", "output": "Can you tell me what what time you like to meditate." }
{"type": "user", "user": "I want to meditate at 5 am in the morning" } 
{"type": "output", "output": "How often you want it to repeat, like onetime or daily" }
{"type": "user", "user": "From tommorow" } 
{"type": "plan", "plan": "I will use createHabit to create a new Todo in DB."}
{"type": "action", "function": "createHabit", "input": {name: "meditaion", startDate: "", startTime: ""}} 
{"type": "function", "function": "1" } 
{"type": "output", "output": "Your Habit has been created successfully" } 
`;

const Tools = {
   Createhabit,
   EditHabit,
   DeleteHabit,
   AddStreak,
   RemoveStreak,
   ListHabit,
   ListStreak,
   GetSteakListAll,
   GetTodaysHabits,
   SearchHabitByName,
};

const chat = asyncHandler(async (req, res) => {
   const { message } = req.body;
   console.log(message);
   if (!message || message.length == 0) {
      return res.status(401).json(new ApiResponse(401, {}, "No message found"));
   }
// { role: "system", content: SYSTEM_PROMPT }
   const messages = [{ role: "system", content: "you are a helpful assistant" }, ...message];
   const chat = await openai.chat.completions.create({
      model: "qwen/qwen2.5-vl-72b-instruct:free",
      messages,
      response_format: { type: "json_object" },
      store: true,
   });
   console.log(chat);
   let response = chat.choices[0].message.content.trim();
   console.log("response", response);
   let action = JSON.parse(response);
   console.log("action", action);
   for (msg of action) {
      message.push({ role: "assistant", content: msg });

      switch (message.type) {
         case "plan":
            continue;
         case "action":
            const fn = Tools[message.function];
            const data = await fn({ ...message.input, user: req.user });
            message.push({ type: "function", function: data.message });
            continue;
         case "output":
            res.status(200).json(new ApiResponse(200, message, "bot reply"));
      }
   }
   console.log("message", message);

   return res
      .status(200)
      .json(new ApiResponse(200, { message: message }, "bot response"));
});

export { chat };
