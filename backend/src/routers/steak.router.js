import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import {
   addStreak,
   addHabit,
   DeleteHabit,
   editHabit,
   listHabit,
   removeStreak,
   getTodaysHabits,
   listStreak,
} from "../controller/taks.controller.js";

const router = Router();

//secure route
router.route("/add").post(verifyJwt, addStreak);
router.route("/remove").post(verifyJwt, removeStreak);
router.route("/habit").get(verifyJwt, listHabit);
router.route("/habit").post(verifyJwt, addHabit);
router.route("/habit-d").post(verifyJwt, DeleteHabit);
router.route("/habit").patch(verifyJwt, editHabit);
router.route("/streak-list").post(verifyJwt, listStreak);
router.route("/habits-today").get(verifyJwt, getTodaysHabits);

export default router;
