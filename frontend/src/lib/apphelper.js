import { Capacitor } from "@capacitor/core";
import axios from "axios";
import { setToken, getToken } from "./storeToken";
import { Device } from "@capacitor/device";

const setTokenToStorageAndAxios = async (dataRec) => {
   if (!Capacitor.isNativePlatform()) return;
   if (dataRec?.accessToken) {
      await setToken("accesstoken", dataRec?.accessToken);
      axios.defaults.headers.common["Accesstoken"] = `Bearer ${dataRec?.accessToken}`;
   }
   if (dataRec?.refreshToken) {
      await setToken("refreshtoken", dataRec?.refreshToken);
      axios.defaults.headers.common["Refreshtoken"] = `Bearer ${dataRec?.refreshToken}`;
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
   const deviceId = await Device.getId();
   const info = await Device.getInfo();
};
export {
   setTokenToStorageAndAxios,
   SetTokenToAxios,
   clearToken,
   SetTheme,
   getTheme,
   logDeviceInfo,
};
