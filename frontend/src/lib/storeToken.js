import { Preferences } from "@capacitor/preferences";

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
   removeToken("lastsyncHL");
   removeToken("lastsyncSL");
   removeToken("deviceRegistered");
   removeToken("tableItems");
   removeToken("accesstoken");
   removeToken("refreshtoken");
   removeToken("habitList");
   removeToken("streakList");
   removeToken("theme");
};

export { setToken, getToken, removeToken, clearTokens };
