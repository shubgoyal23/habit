import { Preferences } from "@capacitor/preferences";
import axios from "axios";
import { conf } from "@/conf/conf";

const SECRET_KEY = conf.SECRET_KEY;

export const setToken = async (token, value) => {
   if (!value || !token) return;
   value = String(value);
   let Val = btoa(
      [...value]
         .map((char, i) =>
            String.fromCharCode(
               char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
            )
         )
         .join("")
   );
   await Preferences.set({
      key: token,
      value: Val,
   });
};
export const getToken = async (token) => {
   if (!token) return;
   const { value } = await Preferences.get({
      key: token,
   });
   if (!value) {
      return null;
   }
   const text = atob(value);
   let Val = [...text]
      .map((char, i) =>
         String.fromCharCode(
            char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
         )
      )
      .join("");
   return Val;
};

export const removeToken = async (token) => {
   await Preferences.remove({ key: token });
};

export const clearTokens = async () => {
   await Preferences.clear();
   axios.defaults.headers.common["Accesstoken"] = "";
   axios.defaults.headers.common["Refreshtoken"] = "";
};
export const SyncClearTokens = async () => {
   await Preferences.clear();
};
