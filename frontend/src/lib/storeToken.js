import { Preferences } from "@capacitor/preferences";
import axios from "axios";

const setToken = async (token, value) => {
   await Preferences.set({
      key: token,
      value: value,
   });
};
const getToken = async (token) => {
   const { value } = await Preferences.get({
      key: token,
   });
   return value;
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
