import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getSuggestedHabits } from "../controller/suggested.controller.js";

const router = Router();

router.route("/").get(verifyJwt, getSuggestedHabits);

export default router;
