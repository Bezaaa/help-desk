"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ticketSchema, TicketInput } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createTicket(data: TicketInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const result = ticketSchema.safeParse(data);
  if (!result.success) return { error: "Invalid input" };

  try {
    await db.ticket.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create ticket" };
  }
}
export async function deleteTicket(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
  
    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) return { error: "Ticket not found" };

    if (ticket.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "Access denied" };
    }

    await db.ticket.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete ticket" };
  }
}

export async function updateTicket(id: string, data: TicketInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const result = ticketSchema.safeParse(data);
  if (!result.success) return { error: "Invalid input" };

  try {
    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket || ticket.userId !== session.user.id) {
      return { error: "Access denied" };
    }

    await db.ticket.update({
      where: { id },
      data: {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update ticket" };
  }
}



export async function updateTicketStatus(
  id: string, 
  status: "OPEN" | "IN_PROGRESS" | "CLOSED"
) {
  try {
    
    const session = await auth();
    if (!session) {
      return { error: "You must be logged in to perform this action." };
    }

   
    if (session.user?.role !== "ADMIN") {
      return { error: "Access Denied: Only administrators can update ticket status." };
    }

    // 3. Update the Database
    await db.ticket.update({
      where: { 
        id: id 
      },
      data: { 
        status: status 
      },
    });

    // 4. Revalidate the cache so the UI updates immediately
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tickets");

    return { success: true };
  } catch (error) {
    console.error("[UPDATE_TICKET_STATUS_ERROR]:", error);
    return { error: "Internal Server Error: Failed to update status." };
  }
}