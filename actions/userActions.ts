"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function verifyUser(userId: string) {
  const session = await auth();


  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access detected." };
  }

  try {
   
    await db.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

   
    await db.notification.create({
      data: {
        userId: userId,
        message: "SYSTEM ALERT: Your operator credentials have been verified.",
        type: "SUCCESS",
      }
    });

   
    revalidatePath("/dashboard/users");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Database operation failed." };
  }
}