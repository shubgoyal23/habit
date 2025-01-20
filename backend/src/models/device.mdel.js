import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
   userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true,
   },
   deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
   },
   model: String,
   platform: String,
   os: String,
   osVersion: String,
   manufacturer: String,
   isVirtual: String,
   webViewVersion: String,
   androidSDKVersion: String,
});

export const Device =
   mongoose.models.Device || mongoose.model("Device", DeviceSchema);
