import { useState } from "react";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";

function NoteCard({ children, note }) {
   const [open, setOpen] = useState(false);
   const toggleCard = () => {
      setOpen((prev) => !prev);
   };
   return (
      <HoverCard open={open} onOpenChange={setOpen}>
         <HoverCardTrigger onClick={toggleCard}>{children}</HoverCardTrigger>
         <HoverCardContent>{note.note}</HoverCardContent>
      </HoverCard>
   );
}

export default NoteCard;
