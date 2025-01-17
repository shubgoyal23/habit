const EpochToTime = (epoch) => {
   epoch = Number(epoch);
   if (!epoch) {
      return;
   }
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
const EpochToDate = (epoch) => {
   epoch = Number(epoch);
   if (!epoch) {
      return;
   }
   let time = new Date(epoch);
   return time;
};

const GetUTCDateEpoch = (date) => {
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

const GetHabitDueToday = (habit) => {
   let list = [...habit];
   let finalList = [];
   let dateToday = new Date();
   for (let i = 0; i < list.length; i++) {
      let startDate = GetUTCDateEpoch(list[i].startDate);
      let endDate = GetUTCDateEpoch(list[i].endDate);
      let currentDate = GetUTCDateEpoch(dateToday);
      if (
         startDate <= currentDate &&
         endDate >= currentDate &&
         list[i].habitType == "negative"
      ) {
         continue;
      }
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
   return finalList;
};

export { EpochToTime, EpochToDate, GetUTCDateEpoch, GetHabitDueToday };
