// convert time as per user time zone
// this is only for server generated time
const getUserTime = (userOffset = 0) => {
    const serverTime = new Date();
    const serTimeOff = serverTime.getTimezoneOffset() * 60 * 1000;
    const UtcTime = serverTime.getTime() + serTimeOff;
    const userTime = UtcTime - userOffset * 60 * 1000;
    return new Date(userTime);
 };

// format time of type 13:00, return hours and minutes
const GetTimeFormated = (data) => {
   data = data?.trim().toLowerCase().replace("am", "").replace("pm", "").trim();
   let startTime = data?.split(":");
   if (startTime.length < 2) {
      return [0, 0];
   }
   let hours = Number(startTime[0]);
   let minutes = Number(startTime[1]);
   return [hours, minutes];
};

// set time of hours and minutes in epoch format based on 1 jan 2025
// input time is in user local time zone, alone with user time zone offset in minutes
const GetTimeEpoch = (hr, min, userOffset = 0) => {
   const epoch = Date.UTC(2025, 0, 1, hr, min, 0, 0); // get epoch in seconds
   let time = Number(epoch + userOffset * 60000);
   const Max = Date.UTC(2025, 0, 1, 23, 59, 59, 59); // it time is grater then 1 jan make it start of 1st jan
   if (time > Max) {
      time = time - 8640000;
   }
   return Math.ceil(time / 1000); // convert user offset in minutes to seconds
};
// set time of hours and minutes in epoch format based on 1 jan 2025, 22:00
const GetTimeZoneEpoch = (hr = 22, min = 0, userOffset = 0) => {
   const epoch = Date.UTC(2025, 0, 1, hr, min, 0, 0);
   const finaltime = Number(epoch + userOffset * 60000);
   const Max = Date.UTC(2025, 0, 1, 23, 59, 59, 59); // it time is grater then 1 jan make it start of 1st jan
   if (finaltime > Max) {
      finaltime = finaltime - 8640000;
   }
   return Math.ceil(finaltime / 1000);
};

// this will return date in epoch format based on 12:00 pm in utc for that date
const GetUTCDateEpoch = (date, userOffset = 0) => {
   if (!date) return;
   let userDate = new Date(date).getTime() - userOffset * 60 * 1000;
   let dateNew = new Date(userDate);
   let utcDate =
      Date.UTC(
         dateNew.getFullYear(),
         dateNew.getMonth(),
         dateNew.getDate(),
         12,
         0,
         0,
         0
      ) / 1000;
   return Math.ceil(utcDate);
};

export { getUserTime, GetTimeFormated, GetTimeEpoch, GetTimeZoneEpoch, GetUTCDateEpoch };
