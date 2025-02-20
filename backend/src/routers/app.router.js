import { Router } from "express";
import { leastAppVersion, RegisterDevice } from "../controller/app.controller.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 60 minutes
   limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
   standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
   // store: ... , // Redis, Memcached, etc. See below.
});

const router = Router();
// router.use(limiter);

//secure route
router.route("/version").get(leastAppVersion);
router.route("/device").post(RegisterDevice);

export default router;
