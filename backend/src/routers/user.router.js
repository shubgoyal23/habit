import { Router } from "express";
import {
   registeruser,
   loginUser,
   logoutUser,
   currentUser,
   editUserDetails,
   editUserPassword,
   forgetPassword,
   refreshToken,
   setFcmToken,
   DeleteUser,
   VerifyOtp,
   ResendOtp,
   FeedbackForm,
   loginUserGoogle,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginUser);
router.route("/login-google").post(loginUserGoogle);
router.route("/verify").post(VerifyOtp);
router.route("/resend-otp").post(ResendOtp);
router.route("/forgot-password").post(forgetPassword);
router.route("/renew-token").get(refreshToken);

//secure route
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/current").get(verifyJwt, currentUser);
router.route("/details").post(verifyJwt, editUserDetails);
router.route("/password").post(verifyJwt, editUserPassword);
router.route("/fcm-token").post(verifyJwt, setFcmToken);
router.route("/close-account").post(verifyJwt, DeleteUser);
router.route("/feedback").post(verifyJwt, FeedbackForm);

export default router;
