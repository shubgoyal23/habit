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

const create2 = tool(Createhabit, {
   name: "CreateHabit",
   description: "Creates a new habit with the provided details",
   schema: z.object({
      name: z.string().describe("The name of the habit"),
      startTime: z
         .string()
         .describe(
            "Time representing the start time of the habit in 00:00 format"
         ),
      startDate: z
         .string()
         .describe(
            "date representing the start date of the habit as input for new Date(date)"
         ),
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
   }),
});

const create = tool(Createhabit, {
   name: "CreateHabit",
   description: "Creates a new habit with the provided details",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
      name: z.string().describe("The name of the habit"),
      startTime: z
         .string()
         .describe(
            "Time representing the start time of the habit in 00:00 format"
         ),
      startDate: z
         .string()
         .describe(
            "date representing the start date of the habit as input for new Date(date)"
         ),
   }),
});

const edit = tool(EditHabit, {
   name: "EditHabit",
   description:
      "Edit habit with the provided details. Only provide details that need to be updated.",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
      id: z.string().describe("ID of the habit to be edited"),
      name: z.string().describe("The name of the habit"),
      startTime: z
         .string()
         .describe(
            "Time representing the start time of the habit in 00:00 format"
         ),
      startDate: z
         .string()
         .describe(
            "date representing the start date of the habit as input for new Date(date)"
         ),
   }),
});

const deletehbt = tool(DeleteHabit, {
   name: "DeleteHabit",
   description: "Deletes a habit",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
      id: z.string().describe("ID of the habit to be deleted"),
   }),
});

const addstrk = tool(AddStreak, {
   name: "AddStreak",
   description: "Adds the current date to the habit streak list",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
      id: z
         .string()
         .describe("ID of the habit whose streak needs to be updated"),
   }),
});

const rmvstrk = tool(RemoveStreak, {
   name: "RemoveStreak",
   description: "Removes the current date from the habit streak list",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
      id: z
         .string()
         .describe("ID of the habit whose streak needs to be removed"),
   }),
});

const listhbt = tool(ListHabit, {
   name: "ListHabit",
   description: "Lists all the habits/todos of the user",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
   }),
});

const todayhbt = tool(GetTodaysHabits, {
   name: "GetTodaysHabits",
   description: "Gets the list of habits due today",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
   }),
});

const srchHabit = tool(SearchHabitByName, {
   name: "SearchHabitByName",
   description: "Finds a habit by name",
   schema: z.object({
      user: z.object({ _id: z.string(), timeZone: z.number() }), // Ensure user is required
      name: z.string().describe("Name of the habit"),
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
