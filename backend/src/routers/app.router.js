import { Router } from "express";
import { leastAppVersion, RegisterDevice } from "../controller/app.controller.js";

const router = Router();

//secure route
router.route("/version").get(leastAppVersion);
router.route("/device").post(RegisterDevice);

export default router;
