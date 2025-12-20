/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { RegisterInput, registerSchema } from "@/lib/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";
import crypto from "crypto";




export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function registerUser(data: RegisterInput) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Invalid input data" };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const verificationToken = crypto.randomBytes(32).toString("hex");

   
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        verificationToken,
        isVerified: false, 
      } 
    })

 
   

    return { 
      success: true, 
      message: "Registration successful! Please check your email to verify your account." 
    };
    
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Something went wrong during registration." };
  }
}





export async function requestPasswordReset(email: string) {
   if (!email) return { error: "Email is required." };
  try {
   
    const user = await db.user.findUnique({ where: { email } });
    
 
    if (!user) {
      return { success: true }; 
    }


    const resetToken = uuidv4();
   
    const resetTokenExpiry = new Date(Date.now() + 3600000); 
   

    
    await db.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry }as any
    }) 

   
    console.log("---------------------------------------");
    console.log("PASSWORD RESET SYSTEM");
    console.log(`User: ${email}`);
    console.log(`Link: http://localhost:3000/new-password?token=${resetToken}`);
    console.log("---------------------------------------");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "System failure. Try again." };
  }
}
export async function updatePassword(token: string, password: string) {

  const user = await db.user.findFirst({
    where: { 
      resetToken: token,
      resetTokenExpiry: { gt: new Date()} 
    },
  });

  if (!user) return { error: "Invalid or expired reset link." };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null 
    } as any
  });

  return { success: true };
}