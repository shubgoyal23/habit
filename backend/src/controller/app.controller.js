import { asyncHandler } from "../utils/asyncHandler.js";
import { ConnectRedis, Redisclient as RedisConn } from "../db/redis.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { Device } from "../models/device.mdel.js";

const leastAppVersion = asyncHandler(async (req, res) => {
   await ConnectRedis();
   const appversion = await RedisConn.get("leastAppVersion");
   return res
      .status(200)
      .json(new ApiResponse(200, { version: appversion }, "success"));
});

const RegisterDevice = asyncHandler(async (req, res) => {
   const {
      deviceId,
      model,
      platform,
      os,
      osVersion,
      manufacturer,
      isVirtual,
      webViewVersion,
      androidSDKVersion,
      userid,
      appVersion
   } = req.body;

   if (!deviceId) {
      throw new ApiError(401, "deviceId is required");
   }
   await Device.findOneAndUpdate(
      { deviceId: deviceId },
      {
         $set: {
            model,
            platform,
            os,
            osVersion,
            manufacturer,
            isVirtual,
            webViewVersion,
            androidSDKVersion,
            userid,
            appVersion,
         },
      },
      { new: true, upsert: true }
   );
   return res
      .status(200)
      .json(new ApiResponse(200, {}, "deviceId updated successfully"));
});

export { leastAppVersion, RegisterDevice };
