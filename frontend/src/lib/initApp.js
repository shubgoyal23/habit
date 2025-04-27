import {
   SetTokenToAxios,
   setTokenToStorageAndAxios,
   getTheme,
} from "./apphelper";
import { getToken, setToken } from "./storeToken";
import { conf } from "../conf/conf";
import { addListHabits } from "../store/HabitSlice";
import { addSteak } from "../store/StreakSlice";
import { LoadNotes, AddNote } from "../store/NoteSlice";
import { login as authlogin } from "../store/AuthSlice";
import axios from "axios";
import { setTheme } from "@/store/ThemeSlice";

export const initThemeAndLogin = async (dispatch) => {
   const theme = await getTheme("theme");
   dispatch(setTheme(theme));
   const loggedIn = await checkUser(dispatch);
   return loggedIn;
};

export const fetchAppDataInBackground = async (dispatch) => {
   Promise.all([
      LoadHabitList(dispatch),
      LoadSteakList(dispatch),
      LoadNotesForMonth(dispatch),
   ]);
};

const checkUser = async (dispatch) => {
   await SetTokenToAxios();
   let storeData = null;
   try {
      const { data } = await axios.get(
         `${conf.BACKEND_URL}/api/v1/users/current`,
         { withCredentials: true }
      );
      storeData = data.data;
   } catch (err) {}

   if (!storeData) {
      try {
         const { data } = await axios.get(
            `${conf.BACKEND_URL}/api/v1/users/renew-token`,
            { withCredentials: true }
         );
         storeData = data.data;
      } catch (err) {}
   }

   if (!storeData) return false;

   dispatch(authlogin(storeData));
   if (storeData?.refreshToken) {
      await setTokenToStorageAndAxios(storeData);
   }
   return true;
};

const LoadHabitList = async (dispatch) => {
   let hlist = await getToken("habitList");
   if (hlist) {
      hlist = JSON.parse(hlist);
      dispatch(addListHabits(hlist));
   }
   let lastsync = await getToken("lastsyncHL");
   lastsync = 1 * 24 * 60 * 60 * 1000 + lastsync;
   if (new Date().getTime() > lastsync) {
      const habitreq = await axios.get(
         `${conf.BACKEND_URL}/api/v1/steak/habit`,
         { withCredentials: true }
      );
      const { data: hData } = habitreq?.data;
      if (hData?.length > 0) {
         setToken("lastsyncHL", new Date().getTime());
         dispatch(addListHabits(hData));
      }
   }
};

const LoadSteakList = async (dispatch) => {
   let slist = await getToken("streakList");
   if (slist) {
      slist = JSON.parse(slist);
      let keys = Object.keys(slist);
      for (let sl of keys) {
         let ids = Object.keys(slist[sl]);
         for (let i = 0; i < ids.length; i++) {
            dispatch(addSteak(slist[sl][ids[i]]));
         }
      }
   }
   let lastsync = await getToken("lastsyncSL");
   lastsync = 1 * 24 * 60 * 60 * 1000 + lastsync;
   if (new Date().getTime() > lastsync) {
      const steakList = await axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/streak-list`,
         { month: new Date().getMonth(), year: new Date().getFullYear() },
         { withCredentials: true }
      );
      const { data: sData } = steakList?.data;
      if (sData?.length > 0) {
         setToken("lastsyncSL", new Date().getTime());
         for (let i = 0; i < sData.length; i++) {
            dispatch(addSteak(sData[i]));
         }
      }
   }
};

const LoadNotesForMonth = async (dispatch) => {
   const notes = await getToken("notes");
   if (notes) {
      const noteslist = JSON.parse(notes);
      if (noteslist) {
         dispatch(LoadNotes(noteslist));
      }
   }
   let lastsync = await getToken("lastsyncNotes");
   lastsync = 1 * 24 * 60 * 60 * 1000 + lastsync;
   let date = new Date();
   if (date.getTime() > lastsync) {
      let sDate = date.getMonth() + "-" + date.getFullYear();
      try {
         const { data } = await axios.post(
            `${conf.BACKEND_URL}/api/v1/notes/list-month`,
            { fulldate: sDate },
            { withCredentials: true }
         );
         const noteslist = data.data;
         if (noteslist.length > 0) {
            for (let i = 0; i < noteslist.length; i++) {
               let dataitem = noteslist[i];
               dispatch(
                  AddNote({
                     id: dataitem.habitId,
                     date: dataitem.date,
                     month: sDate,
                     notesData: {
                        _id: dataitem._id,
                        note: dataitem.note,
                     },
                  })
               );
            }
         }
         setToken("lastsyncNotes", new Date().getTime());
      } catch (err) {
         console.log(err);
      }
   }
};
