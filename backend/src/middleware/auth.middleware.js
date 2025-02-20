import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
   try {
      let token = req.cookies.accessToken || req.headers.accesstoken;
      token = token.replace("Bearer ", "");

      if (!token) {
         throw new ApiError(401, "AccessToken not found");
      }
      const decodedToken = await jwt.verify(
         token,
         process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id)?.select(
         "_id firstName lastName email habitSkip timeZone notify notifyTime"
      );

      req.user = user;
      next();
   } catch (error) {
      throw new ApiError(401, "user not loggedin");
   }
});
