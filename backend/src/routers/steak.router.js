import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import {
   addStreak,
   addHabit,
   deleteHabit,
   editHabit,
   listHabit,
   removeStreak,
   getTodaysHabits,
   listStreak,
   searchHabitByName,
   listHabitArchive,
   archiveHabit,
} from "../controller/taks.controller.js";

const router = Router();

//secure route
router.route("/add").post(verifyJwt, addStreak);
router.route("/remove").post(verifyJwt, removeStreak);
router.route("/habit").get(verifyJwt, listHabit);
router.route("/habit").post(verifyJwt, addHabit);
router.route("/search").post(verifyJwt, searchHabitByName);
router.route("/habit-d").post(verifyJwt, deleteHabit);
router.route("/habit-a").post(verifyJwt, archiveHabit);
router.route("/habit").patch(verifyJwt, editHabit);
router.route("/streak-list").post(verifyJwt, listStreak);
router.route("/habits-today").get(verifyJwt, getTodaysHabits);
router.route("/habit-archive").get(verifyJwt, listHabitArchive);

export default router;
