import { useForm } from "react-hook-form";
import { SendHorizontal } from "lucide-react";

export default function MessageInput({ sendMessage }) {
   const { register, handleSubmit, setValue } = useForm();

   const onSubmit = (data) => {
      const message = data?.context;
      if (!message) return;
      sendMessage(message);
      setValue("context", "");
   };
   return (
      <div className="w-full h-16 p-2">
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-full w-full h-full bg-gray-200/10 flex items-center justify-between p-2 px-4"
         >
            <input
               type="text"
               className="flex-1 h-full bg-transparent outline-none"
               placeholder="Type a message..."
               {...register("context", { required: true })}
            />
            <button type="submit">
               <SendHorizontal className="w-6 h-6" />
            </button>
         </form>
      </div>
   );
}
