import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { addTask, addHabit, DeleteHabit, editHabit } from "../controller/taks.controller.js";

const router = Router();

//secure route
router.route("/add").post(verifyJwt, addTask);
router.route("/habit").post(verifyJwt, addHabit);
router.route("/habit-d").post(verifyJwt, DeleteHabit);
router.route("/habit").patch(verifyJwt, editHabit);

export default router;
