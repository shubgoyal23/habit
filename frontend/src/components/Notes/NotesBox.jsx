import React, { useEffect } from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AddNote, DeleteNote, LoadNotes } from "@/store/NoteSlice";
import { conf } from "@/conf/conf";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "@/lib/storeToken";

function NotesBox({ habitId, date }) {
   if (!habitId || !date) return null;
   const d = new Date(date);
   const sDate = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
   const note = useSelector((state) => state.note);
   const [Notes, setNotes] = React.useState("");
   const [writeNotes, setWriteNotes] = React.useState("");
   const dispatch = useDispatch();

   useEffect(() => {
      if (date) {
         if (note?.[habitId]?.[sDate]) {
            setNotes(note[habitId][sDate]);
            setWriteNotes(note[habitId][sDate].note);
         } else {
            GetNotesForDate();
         }
      }
   }, [note?.[habitId]?.[sDate]]);

   const HandleRequest = async () => {
      if (!writeNotes || writeNotes != Notes?.note) {
         handleAddNotes();
      } else {
         HandleDeleteNote();
      }
   };

   const handleAddNotes = async () => {
      if (writeNotes) {
         const req = axios.post(
            `${conf.BACKEND_URL}/api/v1/notes`,
            {
               habitId,
               fulldate: sDate,
               note: writeNotes,
            },
            {
               withCredentials: true,
            }
         );
         toast.promise(req, {
            loading: "Loading",
            success: "Note added",
            error: (err) =>
               `${err.response?.data?.message || "Something went wrong"}`,
         });
         req.then((data) => {
            let itemdata = data.data.data;
            dispatch(
               AddNote({
                  id: habitId,
                  date: sDate,
                  notesData: { _id: itemdata._id, note: itemdata.note },
               })
            );
         }).catch((err) => console.log(err));
      }
   };

   const HandleDeleteNote = async () => {
      const req = axios.post(
         `${conf.BACKEND_URL}/api/v1/notes/del`,
         {
            noteId: Notes?._id,
         },
         {
            withCredentials: true,
         }
      );
      toast.promise(req, {
         loading: "Loading",
         success: "Note deleted",
         error: (err) =>
            `${err.response?.data?.message || "Something went wrong"}`,
      });
      req.then((data) => {
         dispatch(DeleteNote({ id: habitId, date: sDate }));
         setWriteNotes("");
         setNotes(null);
      }).catch((err) => console.log(err));
   };

   const GetNotesForDate = async () => {
      const notes = await getToken("notes");
      if (notes) {
         const noteslist = JSON.parse(notes);
         if (noteslist?.[habitId]) {
            setNotes(noteslist[habitId][sDate]);
            setWriteNotes(noteslist[habitId][sDate].note);
            dispatch(LoadNotes(noteslist[habitId]));
            return;
         }
      }
      const req = axios.post(
         `${conf.BACKEND_URL}/api/v1/notes/list`,
         {
            fulldate: sDate,
         },
         {
            withCredentials: true,
         }
      );
      req.then((data) => {
         const noteslist = data.data.data;
         if (noteslist.length > 0) {
            for (let i = 0; i < noteslist.length; i++) {
               let dataitem = noteslist[i];
               dispatch(
                  AddNote({
                     id: dataitem.habitId,
                     date: sDate,
                     notesData: {
                        _id: dataitem._id,
                        note: dataitem.note,
                     },
                  })
               );
            }
         }
      }).catch((err) => console.log(err));
   };

   return (
      <div>
         <AlertDialog>
            <AlertDialogTrigger>
               <Pencil1Icon />
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Add Note to Habit</AlertDialogTitle>
                  <AlertDialogDescription>
                     <Textarea
                        className="w-full"
                        placeholder="Add Notes"
                        rows={4}
                        value={writeNotes}
                        onChange={(e) => {
                           let data = e.target.value;
                           if (data.length > 150) {
                              return;
                           }
                           setWriteNotes(data)
                        }}
                     />
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={HandleRequest}>
                     {!writeNotes
                        ? "Add"
                        : writeNotes != Notes?.note
                        ? "Update"
                        : "Delete"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}

export default NotesBox;
