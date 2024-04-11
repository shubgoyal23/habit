import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Streak } from "../models/streak.model.js";
import { User } from "../models/user.model.js";

// const addTask = asyncHandler(async (req, res) => {
//    const { task, point } = req.body;
//    if (!task || !point) {
//       throw new ApiError(401, "Task name and point is required");
//    }

//    let streak = await Streak.findOne({ userId: req.user._id });
//    if (!streak) {
//       streak = await Streak.create({
//          userId: req.user._id,
//          startDate: Date.now(),
//       });
//    }

//    const date = new Date();

//    let check = streak.dailyPoint.find((item) => {
//       if (
//          item.date.getDay() === date.getDay() &&
//          item.date.getMonth() === date.getMonth() &&
//          item.date.getFullYear() === date.getFullYear()
//       ) {
//          let checkTwo = item.task.find((item) => {
//             if (item.taskName === task) {
//                item.point = point;
//                return item;
//             }
//          });

//          if (!checkTwo) {
//             item.task.push({ taskName: task, point: point });
//          }
//          return item;
//       }
//    });

//    if (!check) {
//       streak.dailyPoint.push({
//          date: date,
//          task: [{ taskName: task, point: point }],
//       });
//    }

//    await streak.save();

//    res.status(200).json(
//       new ApiResponse(200, streak, "Steak updated successfully")
//    );
// });

const addTask = asyncHandler(async (req, res) => {
   const { task, point } = req.body;
   if (!task || !point) {
      throw new ApiError(401, "Task name and point are required");
   }

   let streak = await Streak.findOne({ userId: req.user._id });
   if (!streak) {
      streak = await Streak.create({
         userId: req.user._id,
         startDate: Date.now(),
      });
   }

   const currentDate = new Date();

   const matchingDailyPointIndex = streak.dailyPoint.findIndex((item) => {
      const itemDate = new Date(item.date);
      return (
         itemDate.getDate() === currentDate.getDate() &&
         itemDate.getMonth() === currentDate.getMonth() &&
         itemDate.getFullYear() === currentDate.getFullYear()
      );
   });

   if (matchingDailyPointIndex !== -1) {
      const matchingTaskIndex = streak.dailyPoint[
         matchingDailyPointIndex
      ].task.findIndex((item) => {
         return item.taskName === task;
      });

      if (matchingTaskIndex !== -1) {
         streak.dailyPoint[matchingDailyPointIndex].task[
            matchingTaskIndex
         ].point = point;
      } else {
         streak.dailyPoint[matchingDailyPointIndex].task.push({
            taskName: task,
            point: point,
         });
      }
   } else {
      streak.dailyPoint.push({
         date: currentDate,
         task: [{ taskName: task, point: point }],
      });
   }

   await streak.save();

   res.status(200).json(
      new ApiResponse(200, streak, "Streak updated successfully")
   );
});

const listHabit = asyncHandler(async (req, res) => {
   const list = await Streak.find({ userId: req.user._id });

   return res
      .status(200)
      .json(new ApiResponse(200, list, "habit list fetched successfully"));
});
const addHabit = asyncHandler(async (req, res) => {
   const { name, point } = req.body;

   if (!(name && point)) {
      throw new ApiError(401, "Name and Point Feilds are Reqired");
   }

   const add = await Streak.create({
      userId: req.user._id,
      startDate: new Date(),
      ...req.body,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, add, "Habit Added Successfully"));
});

const editHabit = asyncHandler(async (req, res) => {
   const { id } = req.body;
   if (!id) {
      throw new ApiError(401, "id is Reqired");
   }
   const habit = await Streak.findById(id);

   if (!habit || habit.userId == req.user._id) {
      throw new ApiError(403, "Habit not found");
   }

   delete req.body.id;
   const updatedHabit = await Streak.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
   );

   return res
      .status(200)
      .json(new ApiResponse(200, updatedHabit, "Habit updated Successfully"));
});

const DeleteHabit = asyncHandler(async (req, res) => {
   const { id } = req.body;

   if (!id) {
      throw new ApiError(401, "id is Reqired");
   }
   await Streak.findByIdAndDelete(id);
   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Habit deleted Successfully"));
});

export { listHabit, addTask, addHabit, DeleteHabit, editHabit };
