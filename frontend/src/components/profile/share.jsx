import { Share } from "@capacitor/share";
import toast from "react-hot-toast";
import { FaCreditCard } from "react-icons/fa6";

const ShareApp = () => {
   const shareApp = async () => {
      let { value: s } = await Share.canShare();
      if (!s) {
         navigator.clipboard.writeText(
            "https://play.google.com/store/apps/details?id=com.proteinslice.habit"
         );
         toast.success("Copied to clipboard");
         return;
      }
      await Share.share({
         title: "Check out this awesome app!",
         text: "I found this amazing app. You should try it!",
         url: "https://play.google.com/store/apps/details?id=com.proteinslice.habit",
         dialogTitle: "Share My App",
      });
   };

   return (
      <div
         className="flex items-center space-x-2 justify-start gap-2 cursor-pointer"
         onClick={shareApp}
      >
         <FaCreditCard />
         <span>Share with friends</span>
      </div>
   );
};

export default ShareApp;
