import { Capacitor } from "@capacitor/core";
import axios from "axios";
import { setToken, getToken } from "./storeToken";
import { Device } from "@capacitor/device";
import { App } from "@capacitor/app";

const setTokenToStorageAndAxios = async (dataRec) => {
   if (!Capacitor.isNativePlatform()) return;
   if (dataRec?.accessToken) {
      await setToken("accesstoken", dataRec?.accessToken);
      axios.defaults.headers.common[
         "Accesstoken"
      ] = `Bearer ${dataRec?.accessToken}`;
   }
   if (dataRec?.refreshToken) {
      await setToken("refreshtoken", dataRec?.refreshToken);
      axios.defaults.headers.common[
         "Refreshtoken"
      ] = `Bearer ${dataRec?.refreshToken}`;
   }
};

const SetTokenToAxios = async () => {
   if (!Capacitor.isNativePlatform()) return;
   let accessToken = await getToken("accesstoken");
   let refreshToken = await getToken("refreshtoken");
   axios.defaults.headers.common["Accesstoken"] = `Bearer ${accessToken}`;
   axios.defaults.headers.common["Refreshtoken"] = `Bearer ${refreshToken}`;
};

const clearToken = async () => {
   if (!Capacitor.isNativePlatform()) return;
   await setToken("accesstoken", "");
   await setToken("refreshtoken", "");
   axios.defaults.headers.common["Accesstoken"] = "";
   axios.defaults.headers.common["Refreshtoken"] = "";
};

const SetTheme = async (theme) => {
   await setToken("theme", theme);
};
const getTheme = async () => {
   return getToken("theme");
};

const logDeviceInfo = async () => {
   if (!Capacitor.isNativePlatform()) return;
   const deviceId = await Device.getId();
   const info = await Device.getInfo();
   const { version } = await App.getInfo();
   let device = {};
   device.deviceId = deviceId?.identifier;
   device.model = info.model;
   device.platform = info.platform;
   device.os = info.operatingSystem;
   device.osVersion = info.osVersion;
   device.manufacturer = info.manufacturer;
   device.isVirtual = info.isVirtual;
   device.webViewVersion = info.webViewVersion;
   device.androidSDKVersion = info.androidSDKVersion;
   device.appVersion = version;
   return device;
};

const GetDeviceId = async () => {
   if (!Capacitor.isNativePlatform()) return;
   return await Device.getId();
};
export {
   setTokenToStorageAndAxios,
   SetTokenToAxios,
   clearToken,
   SetTheme,
   getTheme,
   logDeviceInfo,
   GetDeviceId,
};
