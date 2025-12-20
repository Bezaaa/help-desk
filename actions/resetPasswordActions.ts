"use server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function resetPassword(token: string, newPassword: string) {
  const user = await db.user.findFirst({
    where: { 
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
    },
  });

  if (!user) return { error: "Link expired or invalid." };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { success: true };
}