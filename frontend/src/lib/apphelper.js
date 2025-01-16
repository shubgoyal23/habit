import { Capacitor } from "@capacitor/core";
import axios from "axios";
import { setToken, getToken } from "./storeToken";

const setTokenToStorageAndAxios = async (dataRec) => {
   if (!Capacitor.isNativePlatform()) return;
   if (dataRec?.accessToken) {
      await setToken("accesstoken", dataRec?.accessToken);
      axios.defaults.headers.common["accesstoken"] = dataRec?.accessToken;
   }
   if (dataRec?.refreshToken) {
      await setToken("refreshtoken", dataRec?.refreshToken);
      axios.defaults.headers.common["refreshtoken"] = dataRec?.refreshToken;
   }
};

const SetTokenToAxios = async () => {
   if (!Capacitor.isNativePlatform()) return;
   let accessToken = await getToken("accessToken");
   let refreshToken = await getToken("refreshToken");
   axios.defaults.headers.common["refreshToken"] = refreshToken;
   axios.defaults.headers.common["accessToken"] = accessToken;
};

const clearToken = async () => {
   if (!Capacitor.isNativePlatform()) return;
   await setToken("accesstoken", "");
   await setToken("refreshtoken", "");
   axios.defaults.headers.common["accesstoken"] = "";
   axios.defaults.headers.common["refreshtoken"] = "";
};

export { setTokenToStorageAndAxios, SetTokenToAxios, clearToken };
