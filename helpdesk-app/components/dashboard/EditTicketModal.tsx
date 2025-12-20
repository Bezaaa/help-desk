/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, TicketInput } from "@/lib/schema";
import { updateTicket } from "@/actions/ticketActions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function EditTicketModal({ ticket, open, setOpen }: any) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
    },
  });

  const onSubmit = (values: TicketInput) => {
    startTransition(async () => {
      const res = await updateTicket(ticket.id, values);
      if (res.success) {
        toast.success("Ticket updated");
        setOpen(false);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             {/* ... Exact same fields as CreateTicketModal ... */}
             <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} className="bg-zinc-950 border-zinc-800" /></FormControl>
                  <FormMessage />
                </FormItem>
             )} />
             
             <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} className="bg-zinc-950 border-zinc-800" /></FormControl>
                  <FormMessage />
                </FormItem>
             )} />

             <Button type="submit" disabled={isPending} className="w-full bg-indigo-600">
               {isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
             </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}