import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
   Createhabit,
   EditHabit,
   DeleteHabit,
   AddStreak,
   RemoveStreak,
   ListHabit,
   GetTodaysHabits,
   SearchHabitByName,
} from "./task.helpers.js";

const create = tool(Createhabit, {
   name: "CreateHabit",
   description: "Creates a new habit with the provided details",
   schema: z.object({
      name: z.string("The name of the habit"),
      startTime: z.string(
         "Time representing the start time of the habit in 00:00 format"
      )
   }),
});
const create2 = tool(Createhabit, {
   name: "CreateHabit",
   description: "Creates a new habit with the provided details",
   schema: z.object({
      name: z.string("The name of the habit"),
      description: z.string("Detailed description of the habit").optional(),
      duration: z
         .string("Duration of the habit, e.g., '30 minutes'")
         .optional(),
      startTime: z.string(
         "Time representing the start time of the habit in 00:00 format"
      ),
      endTime: z
         .string("Time representing the end time of the habit in 00:00 format")
         .optional(),
      startDate: z
         .string("Epoch or date string representing the start date")
         .optional(),
      endDate: z
         .string("Epoch or date string representing the end date")
         .optional(),
      repeat: z
         .object({
            name: z.enum(
               ["days", "dates", "hours", "todo"],
               "Type of repetition"
            ),
            value: z.array(
               z.number(
                  "Repetition values, e.g., days of the week. date or minutes, if todo leave empty"
               )
            ),
         })
         .optional(),
      place: z.string("Location where the habit will take place").optional(),
      how: z.string("Method of performing the habit").optional(),
      ifthen: z.string("Conditional statement for the habit").optional(),
      point: z.number("Points awarded for completing the habit").optional(),
      habitType: z.enum(
         ["regular", "negative", "todo"],
         "Type of habit default regular"
      ),
      notify: z.boolean("Whether to send notifications").default(true),
   }),
});
const edit = tool(EditHabit, {
   name: "EditHabit",
   description:
      "Edit habit with the provided details, only provide details which need to be updated.",
   schema: z.object({
      id: z.string("id of habit which need to be edited"),
      name: z.string("The name of the habit").optional(),
      description: z.string("Detailed description of the habit").optional(),
      duration: z
         .string("Duration of the habit, e.g., '30 minutes'")
         .optional(),
      startTime: z
         .string(
            "Time representing the start time of the habit in 00:00 format"
         )
         .optional(),
      endTime: z
         .string("Time representing the end time of the habit in 00:00 format")
         .optional(),
      startDate: z
         .string("Epoch/date object time representing the start date")
         .optional(),
      endDate: z
         .string("Epoch/date object time representing the end date")
         .optional(),
      repeat: z
         .object({
            name: z.enum(
               ["days", "dates", "hours", "todo"],
               "Type of repetition"
            ),
            value: z.array(
               z.number(
                  "Repetition values, e.g., days of the week. date or minutes, if todo leave empty"
               )
            ),
         })
         .optional(),
      place: z.string("Location where the habit will take place").optional(),
      how: z.string("Method of performing the habit").optional(),
      ifthen: z.string("Conditional statement for the habit").optional(),
      point: z.number("Points awarded for completing the habit").optional(),
      habitType: z
         .enum(["regular", "negative", "todo"], "Type of habit")
         .optional(),
      notify: z.boolean("Whether to send notifications").optional(),
   }),
});
const deletehbt = tool(DeleteHabit, {
   name: "DeleteHabit",
   description: "Delete habit",
   schema: z.object({
      id: z.string("id of habit which need to be deleted"),
   }),
});
const addstrk = tool(AddStreak, {
   name: "AddStreak",
   description: "add current date in habit streak list",
   schema: z.object({
      id: z.string("id of habit whose streak need to be added"),
   }),
});
const rmvstrk = tool(RemoveStreak, {
   name: "RemoveStreak",
   description: "remove current date from habit streak list",
   schema: z.object({
      id: z.string("id of habit whose streak need to be added"),
   }),
});
const listhbt = tool(ListHabit, {
   name: "ListHabit",
   description: "List all the habits/todos of user",
   schema: null,
});
const todayhbt = tool(GetTodaysHabits, {
   name: "GetTodaysHabits",
   description: "Get list of habit due today",
   schema: null,
});
const srchHabit = tool(SearchHabitByName, {
   name: "SearchHabitByName",
   description: "find habit by name",
   schema: z.object({
      name: z.string("name of habit"),
   }),
});

export {
   create,
   edit,
   deletehbt,
   addstrk,
   rmvstrk,
   listhbt,
   todayhbt,
   srchHabit,
};
