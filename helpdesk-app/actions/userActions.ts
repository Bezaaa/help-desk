"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function verifyUser(userId: string) {
  const session = await auth();

  // 1. Security check: Only Admins can verify
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized access detected." };
  }

  try {
    // 2. Update the user in the database
    await db.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    // 3. Create a notification for that user
    await db.notification.create({
      data: {
        userId: userId,
        message: "SYSTEM ALERT: Your operator credentials have been verified.",
        type: "SUCCESS",
      }
    });

    // 4. Refresh the page data
    revalidatePath("/dashboard/users");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Database operation failed." };
  }
}