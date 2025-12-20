/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { deleteTicket } from "@/actions/ticketActions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditTicketModal } from "./EditTicketModal";


export function TicketActionMenu({ ticket }: { ticket: any }) {
  const [isPending, startTransition] = useTransition();
  const [showEditModal, setShowEditModal] = useState(false);

  const onDelete = () => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    
    startTransition(async () => {
      const res = await deleteTicket(ticket.id);
      if (res.success) toast.success("Ticket deleted");
      else toast.error(res.error);
    });
  };

  return (
    <>
      <EditTicketModal 
        ticket={ticket} 
        open={showEditModal} 
        setOpen={setShowEditModal} 
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
          <DropdownMenuItem 
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDelete}
            disabled={isPending}
            className="cursor-pointer text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}