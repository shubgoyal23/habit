import { Router } from "express";

import { verifyJwt } from "../middleware/auth.middleware.js";
import { addTask } from "../controller/taks.controller.js";

const router = Router();


//secure route
router.route("/add").post(verifyJwt, addTask);

export default router;
