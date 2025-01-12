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

export { EpochToTime, EpochToDate };
