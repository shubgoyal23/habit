import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { addSteak, addHabit, DeleteHabit, editHabit, listHabit, removeSteak } from "../controller/taks.controller.js";

const router = Router();

//secure route
router.route("/add").post(verifyJwt, addSteak);
router.route("/remove").post(verifyJwt, removeSteak);
router.route("/habit").get(verifyJwt, listHabit);
router.route("/habit").post(verifyJwt, addHabit);
router.route("/habit-d").post(verifyJwt, DeleteHabit);
router.route("/habit").patch(verifyJwt, editHabit);

export default router;
