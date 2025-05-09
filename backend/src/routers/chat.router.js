import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { chat } from "../controller/chat.controller.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
   standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
   // store: ... , // Redis, Memcached, etc. See below.
});

const router = Router();
router.use(limiter);

//secure route
router.route("/").post(verifyJwt, chat);

export default router;
