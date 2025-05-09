import { ConnectRedis, Redisclient } from "../db/redis.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { SendOtp } from "../utils/Email.js";
import { Habit } from "../models/habit.model.js";
import { Device } from "../models/device.mdel.js";
import { Feedback } from "../models/feedback.js";
import { Streak } from "../models/Streak.model.js";
import { GetTimeZoneEpoch } from "../helpers/task.helpers.js";
import { OAuth2Client } from "google-auth-library";
import { userDataRemoveSensitiveData } from "../helpers/helpers.js";

const generateAccessTokenAndRefresToken = async (id) => {
   try {
      const user = await User.findById(id);
      const refreshToken = await user.generateRefreshToken();
      const accessToken = await user.generateAccessToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { refreshToken, accessToken };
   } catch (error) {
      console.log(error);
      throw new ApiError(500, "error generating refrestToken");
   }
};
const registeruser = asyncHandler(async (req, res) => {
   const { firstName, lastName, email, password, timeZone } = req.body;

   if (!firstName || !email || !password) {
      throw new ApiError(
         401,
         "firstName, Email, and Password is required to register user"
      );
   }

   const checkuser = await User.findOne({ email });
   if (checkuser) {
      throw new ApiError(403, "User with same Email id is already registered");
   }

   const otpcheck = await SendOtp(email, firstName);
   if (!otpcheck) {
      throw new ApiError(500, "user registration failed");
   }
   const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      timeZone,
      isActive: false,
      notify: true,
      notifyTime: GetTimeZoneEpoch(22, 0, timeZone),
   });
   await ConnectRedis();
   await Redisclient.set(
      `OTP:${user._id.toString()}`,
      JSON.stringify({ email, otp: otpcheck, attempt: 3 })
   );
   Redisclient.expire(`OTP:${user._id.toString()}`, 300);

   const checkUserRegistered = await User.findOne({ email })?.select(
      "_id firstName lastName"
   );

   if (!checkUserRegistered) {
      throw new ApiError(500, "user registration failed");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            checkUserRegistered,
            "user Registered successfully"
         )
      );
});

const VerifyOtp = asyncHandler(async (req, res) => {
   const { id, otp, type } = req.body;
   if (!id || !otp || !type) {
      throw new ApiError(403, "unauthorise request");
   }
   await ConnectRedis();
   const data = await Redisclient.get(`OTP:${id}`);
   if (!data) {
      throw new ApiError(400, "OTP expired");
   }

   const { email, attempt, otp: otpcheck } = JSON.parse(data);
   if (attempt <= 0) {
      throw new ApiError(400, "OTP expired");
   }
   if (otpcheck != otp) {
      throw new ApiError(403, "Wrong OTP");
   }
   const finduser = await User.findOne({ email });
   if (!finduser) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }
   if (finduser._id.toString() != id) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }
   await ConnectRedis();
   Redisclient.del(`OTP:${id}`);
   if (type == "register" || type == "verify-email") {
      await User.findOneAndUpdate({ email }, { isActive: true });
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { _id: id, email, type },
            "Verification successfully"
         )
      );
});
const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new ApiError(401, "Email, and Password is required to Login");
   }

   const finduser = await User.findOne({ email });
   if (!finduser) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }
   if (!finduser.isActive) {
      throw new ApiError(
         403,
         "Email Not Verified, Please verify your email to login"
      );
   }
   if (finduser.thirdPartyLogin) {
      throw new ApiError(
         403,
         `You are registered with ${finduser.thirdPartyLogin} account. Please login with ${finduser.thirdPartyLogin} account`
      );
   }

   const checkpass = await finduser.checkPassword(password);

   if (!checkpass) {
      throw new ApiError(403, "Wrong Email or Password");
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(finduser._id);

   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
   };

   let user = userDataRemoveSensitiveData(finduser);

   user.refreshToken = refreshToken;
   user.accessToken = accessToken;

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "User Logged in successfully"));
});
const loginUserGoogle = asyncHandler(async (req, res) => {
   const { token, timeZone } = req.body;

   if (!token) {
      throw new ApiError(401, "Tokein is required to Login");
   }
   const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
   );

   const { tokens } = await client.getToken({
      code: token,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
   });

   if (!tokens) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }
   client.setCredentials(tokens);

   const userInfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
   });

   let payload = userInfo.data;
   const email = payload?.email;

   let finduser = await User.findOne({ email });
   if (!finduser) {
      finduser = await User.create({
         email,
         firstName: payload?.given_name,
         lastName: payload?.family_name,
         picture: payload?.picture,
         timeZone,
         isActive: true,
         notify: true,
         notifyTime: GetTimeZoneEpoch(22, 0, timeZone),
         thirdPartyLogin: true,
         thirdPartyInfo: {
            provider: "Google",
            uid: payload?.id,
         },
      });
   }

   if (!finduser.isActive) {
      throw new ApiError(
         403,
         "Email Not Verified, Please verify your email to login"
      );
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(finduser._id);

   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
   };
   let user = {};
   user._id = finduser._id;
   user.firstName = finduser.firstName;
   user.lastName = finduser.lastName;
   user.notify = finduser.notify;
   user.notifyTime = finduser.notifyTime;
   user.refreshToken = refreshToken;
   user.accessToken = accessToken;

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "User Logged in successfully"));
});

const ResendOtp = asyncHandler(async (req, res) => {
   const { email, type } = req.body;

   if (!email) {
      throw new ApiError(401, "Email is required to register user");
   }

   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }

   if (type == "verify-email" && user.isActive) {
      throw new ApiError(
         403,
         "Email Already Verified, Please login to continue"
      );
   }

   const otpcheck = await SendOtp(email, user.firstName);
   if (!otpcheck) {
      throw new ApiError(500, "user verification failed");
   }
   await ConnectRedis();
   await Redisclient.set(
      `OTP:${user._id.toString()}`,
      JSON.stringify({ email, otp: otpcheck, attempt: 3 })
   );
   Redisclient.expire(`OTP:${user._id.toString()}`, 300);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            { _id: user._id },
            "An Email to verify your account has been send to your email id"
         )
      );
});
const logoutUser = asyncHandler(async (req, res) => {
   const { _id } = req.user;

   const finduser = await User.findByIdAndUpdate(
      _id,
      {
         $unset: {
            refreshToken: 1,
         },
      },
      { new: true }
   );

   if (!finduser) {
      throw new ApiError(403, "User not found");
   }

   const options = {
      httpOnly: true,
      secure: true,
   };

   res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out Successfully"));
});

const currentUser = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
   let token = req.cookies.refreshToken || req.headers.refreshtoken;
   token = token?.replace("Bearer ", "");
   if (!token) {
      throw new ApiError(401, "RefreshToken not found");
   }
   const decodedToken = await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
   );

   const user = await User.findById(decodedToken._id);

   if (!user && !(user?.refreshToken === token)) {
      throw new ApiError(401, "User not found");
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(user._id);

   let userData = userDataRemoveSensitiveData(user);

   userData.accessToken = accessToken;
   userData.refreshToken = refreshToken;
   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, userData, "Tokens Renewed successfully"));
});

const editUserDetails = asyncHandler(async (req, res) => {
   let { firstName, lastName, notify, notifyTime } = req.body;
   const id = req.user._id;

   const updateuser = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      notify,
      notifyTime,
   });
   if (!updateuser) {
      throw new ApiError(500, "user details update failed");
   }

   const user = userDataRemoveSensitiveData(updateuser);

   return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated successfully"));
});
const editUserPassword = asyncHandler(async (req, res) => {
   let { password, newPassword } = req.body;
   const id = req.user._id;

   const user = await User.findById(id);

   const passcheck = await user.checkPassword(password);

   if (!passcheck) {
      throw new ApiError(403, "old password is incorrect");
   }

   user.password = newPassword;
   await user.save();

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "Account password updated successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
   let { email, password, _id } = req.body;

   if (!email || !password || !_id) {
      throw new ApiError(401, "all fields are required");
   }

   const user = await User.findOne({ email, _id, isActive: true });
   if (!user) {
      throw new ApiError(401, "user with email not found");
   }

   user.password = password;
   await user.save();

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            {},
            "Password updated successfully, you can login now"
         )
      );
});

const setFcmToken = asyncHandler(async (req, res) => {
   const { fcmToken } = req.body;
   if (!fcmToken) {
      throw new ApiError(401, "fcmToken is required");
   }
   const id = req.user._id;
   await User.findByIdAndUpdate(id, { fcmToken });
   return res
      .status(200)
      .json(new ApiResponse(200, {}, "fcmToken updated successfully"));
});

const DeleteUser = asyncHandler(async (req, res) => {
   let { email, password, confirm } = req.body;

   if (!email || !password || !confirm) {
      throw new ApiError(401, "All fields are required");
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(401, "User not found");
   }

   if (user.email != req.user.email) {
      throw new ApiError(403, "unauthorized user, Check email id and password");
   }
   if (!user.checkPassword(password)) {
      throw new ApiError(403, "unauthorized user, Check email id and password");
   }
   await User.findByIdAndDelete(user._id);
   let ids = await Habit.find({ userId: user._id }).select("_id");
   await Habit.deleteMany({ userId: user._id });
   await Streak.deleteMany({ userId: user._id });
   await Device.deleteMany({ userId: user._id });

   // remove from redis too
   let rmids = [];
   await ConnectRedis();
   for (let i = 0; i < ids.length; i++) {
      rmids.push(ids[i]._id.toString());
   }
   await ConnectRedis();
   await Redisclient.SREM("AllHabitLists", rmids);
   const options = {
      httpOnly: true,
      secure: true,
   };
   return res
      .status(200)
      .cookie("accessToken", "", options)
      .cookie("refreshToken", "", options)
      .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const FeedbackForm = asyncHandler(async (req, res) => {
   let { topic, desc } = req.body;

   if (!topic || !desc) {
      throw new ApiError(401, "All fields are required");
   }

   const f = await Feedback.create({
      userid: req.user?._id,
      topic,
      desc,
   });

   if (!f) {
      throw new ApiError(500, "Internal server error");
   }

   return res
      .status(200)
      .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
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
};
