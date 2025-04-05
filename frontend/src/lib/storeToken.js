import { Preferences } from "@capacitor/preferences";
import axios from "axios";

const setToken = async (token, value, key = "secret") => {
   if (!value || !token) return;
   value = String(value);
   let Val = btoa(
      [...value]
         .map((char, i) =>
            String.fromCharCode(
               char.charCodeAt(0) ^ key.charCodeAt(i % key.length)
            )
         )
         .join("")
   );
   await Preferences.set({
      key: token,
      value: Val,
   });
};
const getToken = async (token, key = "secret") => {
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
            char.charCodeAt(0) ^ key.charCodeAt(i % key.length)
         )
      )
      .join("");
   return Val;
};

const removeToken = async (token) => {
   await Preferences.remove({ key: token });
};

const clearTokens = async () => {
   await Preferences.clear();
   axios.defaults.headers.common["Accesstoken"] = "";
   axios.defaults.headers.common["Refreshtoken"] = "";
};

export { setToken, getToken, removeToken, clearTokens };
