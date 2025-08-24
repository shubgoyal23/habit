import React, { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { conf } from "@/conf/conf";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addSteak } from "@/store/StreakSlice";
import notificationSound from "../../resources/timer_notify.mp3";
import { Volume2, VolumeX } from "lucide-react";

function useQuery() {
   return new URLSearchParams(useLocation().search);
}

function Timer() {
   const navigate = useNavigate();
   const query = useQuery();
   const id = query.get("id");
   const min = query.get("min");
   const sec = query.get("sec");
   const dispatch = useDispatch();

   const [time, setTime] = useState({
      min: min || 25,
      sec: sec || 0,
   });
   const audio = new Audio(notificationSound);
   const [tune, setTune] = useState(true);
   const intervalRef = React.useRef(null);

   const FinishTimmer = (done) => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (done && id) {
         markHabitDone();
         if (tune) {
            audio.play();
         }
      }
   };

   const markHabitDone = () => {
      const request = axios.post(
         `${conf.BACKEND_URL}/api/v1/steak/add`,
         { id: id },
         {
            withCredentials: true,
         },
      );
      toast.promise(request, {
         loading: "Loading",
         success: (data) =>
            `${data.data?.message || "Habit Marked successfully"}`,
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      request
         .then((data) => {
            dispatch(addSteak(data.data.data));
         })
         .catch((err) => console.log(err));
   };

   const startTimer = () => {
      if (intervalRef.current) {
         FinishTimmer();
         return;
      }
      intervalRef.current = setInterval(() => {
         setTime((prev) => {
            let { min, sec } = prev;
            if (min === 0 && sec === 0) {
               FinishTimmer(true);
               return { min: 0, sec: 0 };
            }

            if (sec === 0) {
               return { min: min - 1, sec: 59 };
            } else {
               return { min, sec: sec - 1 };
            }
         });
      }, 1000);
   };

   return (
      <div className="w-full h-full flex justify-center items-center">
         <Card className="mx-auto max-w-md w-full">
            <CardHeader className="space-y-1">
               <div className="flex items-center space-x-2 justify-between gap-2">
                  <CardTitle className="text-2xl font-bold">Pomodoro</CardTitle>
                  <div
                     className="cursor-pointer"
                     onClick={() => setTune((prev) => !prev)}
                  >
                     {tune ? <Volume2 /> : <VolumeX />}
                  </div>
               </div>
               <CardDescription>
                  Set a timer and focus on your tasks with ease
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <h2>Time Left</h2>
                     <div className="space-y-1 p-2 pl-3 bg-primary/20 rounded-lg shadow flex flex-col gap-2">
                        <div className="flex text-8xl  items-center space-x-2 justify-center gap-2">
                           {time.min}:
                           {time.sec < 10 ? "0" + time.sec : time.sec}
                        </div>
                     </div>
                  </div>
               </div>
               {!intervalRef.current && (
                  <div className="space-y-4 pt-5">
                     <div className="space-y-2">
                        <h2>Set Time</h2>
                        <div className="space-y-1 p-1 rounded-lg flex flex-col gap-2">
                           <div className="flex items-center space-x-2 justify-start gap-2">
                              <div>
                                 <Label className="mb-2 pl-2">Minutes</Label>
                                 <Input
                                    type="number"
                                    value={time.min}
                                    onChange={(e) => {
                                       let value = Number(e.target.value);
                                       if (!value) return;
                                       if (value > 180) return;
                                       if (value < 0) return;
                                       setTime((prev) => {
                                          return {
                                             ...prev,
                                             min: value,
                                          };
                                       });
                                    }}
                                 />
                              </div>
                              <div>
                                 <Label className="mb-2 pl-2">Second</Label>
                                 <Input
                                    type="number"
                                    value={time.sec}
                                    onChange={(e) => {
                                       let value = Number(e.target.value);
                                       if (!value) return;
                                       if (value > 59) return;
                                       if (value < 0) return;
                                       setTime((prev) => {
                                          return {
                                             ...prev,
                                             sec: value,
                                          };
                                       });
                                    }}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               <CardFooter className="p-0 pt-5 justify-between flex-col gap-2">
                  <Button
                     className={`w-full py-2 rounded-md ${
                        intervalRef.current ? "bg-destructive" : "bg-primary"
                     }  text-white`}
                     onClick={startTimer}
                  >
                     {intervalRef.current ? "Stop" : "Start"}
                  </Button>
                  {intervalRef.current === null && (
                     <Button
                        variant={"outline"}
                        className="w-full"
                        onClick={() => navigate("/")}
                     >
                        Close
                     </Button>
                  )}
               </CardFooter>
            </CardContent>
         </Card>
      </div>
   );
}

export default Timer;
