/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function markAsRead(notificationId: string) {
  await db.notification.update({
    where: { id: notificationId },
    data: { isRead: true } as any
  });
  revalidatePath("/dashboard");
}