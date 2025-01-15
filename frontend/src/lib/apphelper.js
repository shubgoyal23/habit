import { Capacitor } from "@capacitor/core";
import axios from "axios";
import { setToken, getToken } from "./storeToken";
import { sendFcmTokenToServer } from "./notification";

const setTokenToStorageAndAxios = async (dataRec) => {
   if (!Capacitor.isNativePlatform()) return;
   await setToken("accessToken", dataRec.accessToken);
   await setToken("refreshToken", dataRec.refreshToken);
   axios.defaults.headers.common["refreshToken"] = dataRec?.refreshToken;
   axios.defaults.headers.common["accessToken"] = dataRec?.accessToken;
   await sendFcmTokenToServer();
};

const SetTokenToAxios = async () => {
   if (!Capacitor.isNativePlatform()) return;
   let accessToken = await getToken("accessToken");
   let refreshToken = await getToken("refreshToken");
   axios.defaults.headers.common["refreshToken"] = refreshToken;
   axios.defaults.headers.common["accessToken"] = accessToken;
};

export { setTokenToStorageAndAxios, SetTokenToAxios };
