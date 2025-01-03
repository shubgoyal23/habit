import { Streak } from "../models/streak.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

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
   const { firstName, lastName, email, password } = req.body;

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

   const user = await User.create({
      email,
      password,
      firstName,
      lastName,
   });

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

const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new ApiError(401, "Email, and Password is required to Login");
   }

   const finduser = await User.findOne({ email });
   if (!finduser) {
      throw new ApiError(403, "User not found, check Email id or register one");
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
      maxAge: 864000000,
   };

   let user = {};
   user._id = finduser._id;
   user.firstName = finduser.firstName;
   user.lastName = finduser.lastName;
   user.refreshToken = refreshToken;
   user.accessToken = accessToken;

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "User Logged in successfully"));
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
   let user = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
   };
   return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
   const token = req.cookies.refreshToken || req.headers.refreshtoken;

   if (!token) {
      throw new ApiError(401, "RefreshToken not found");
   }
   const decodedToken = await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
   );

   const user = await User.findById(decodedToken._id)?.select(
      "_id firstName lastName refreshToken"
   );

   if (!user && !(user.refreshToken === token)) {
      throw new ApiError(401, "User not found");
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(user._id);

   user.accessToken = accessToken;
   user.refreshToken = refreshToken;
   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 864000000,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "Tokens Renewed successfully"));
});

const editUserDetails = asyncHandler(async (req, res) => {
   let { firstName, lastName, email } = req.body;
   const id = req.user._id;

   if (!firstName) {
      firstName = req.user.firstName;
   }
   if (!lastName) {
      lastName = req.user.lastName;
   }
   if (!email) {
      email = req.user.email;
   }

   const updateuser = await User.findByIdAndUpdate(
      id,
      {
         $set: {
            firstName,
            lastName,
            email,
         },
      },
      { new: true }
   ).select("-password -refreshToken");

   if (!updateuser) {
      throw new ApiError(500, "user details update failed");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            updateuser,
            "Account details updated successfully"
         )
      );
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
   let { email } = req.body;

   if (!email) {
      throw new ApiError(401, "email id is required");
   }

   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(401, "user with email not found");
   }

   //send email todo

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            {},
            "An Email to reset password has been send to your email id"
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

   if (email !== req.user.email) {
      throw new ApiError(403, "unauthorized user, Check email id and password");
   }
   const user = await User.findOne({ email });

   if (!user) {
      throw new ApiError(401, "User not found");
   }
   if (!user.checkPassword(password)) {
      throw new ApiError(403, "unauthorized user, Check email id and password");
   }
   await User.findByIdAndDelete(user._id);
   await Streak.deleteMany({ userId: id });
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
};
