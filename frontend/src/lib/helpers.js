export const EpochToTime = (epoch) => {
   if (!epoch) {
      return;
   }
   epoch = Number(epoch);
   let time = new Date(epoch);
   let hr = time.getHours();
   let min = time.getMinutes();
   if (hr < 10) {
      hr = "0" + hr;
   }
   if (min < 10) {
      min = "0" + min;
   }
   return `${hr}:${min}`;
};
export const EpochToDate = (epoch) => {
   epoch = Number(epoch);
   if (!epoch) {
      return;
   }
   let time = new Date(epoch);
   return time;
};

export const GetUTCDateEpoch = (date) => {
   if (!date) return;
   let dateNew = new Date(date);
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

export const GetHabitDueToday = (habit) => {
   let list = [...habit];
   let finalList = [];
   let dateToday = new Date();
   let currentDate = GetUTCDateEpoch(dateToday);

   for (let i = 0; i < list.length; i++) {
      switch (list[i]?.habitType) {
         case "negative":
            continue;
         case "todo":
            if (GetUTCDateEpoch(list[i].startDate * 1000) == currentDate)
               finalList.push(list[i]);
            continue;
         case "regular":
            let startDate = GetUTCDateEpoch(list[i].startDate * 1000);
            let endDate = GetUTCDateEpoch(list[i].endDate * 1000);
            if (startDate > currentDate || endDate < currentDate) continue;
            if (list[i].repeat.name == "days") {
               if (list[i].repeat.value.includes(dateToday.getUTCDay())) {
                  finalList.push(list[i]);
               }
            } else if (list[i].repeat.name == "dates") {
               if (list[i].repeat.value.includes(currentDate)) {
                  finalList.push(list[i]);
               }
            } else if (list[i].repeat.name == "todo") {
               finalList.push(list[i]);
            }
      }
   }
   return finalList;
};
