"use server";

import { db } from "@/lib/db";
import { RegisterInput, registerSchema } from "@/lib/schema";
import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";


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

    // 1. Generate a random verification token
    const verificationToken = Math.random().toString(36).substring(2, 15);

    // 2. Create the user with the token and isVerified: false
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        verificationToken,
        isVerified: false, 
      },
    });

    // NOTE FOR INTERVIEW: 
    // Here is where you would call: await sendVerificationEmail(email, verificationToken);
    console.log(`[SERVER]: Verification email logic triggered for ${email}. Token: ${verificationToken}`);

    return { 
      success: true, 
      message: "Registration successful! Please check your email to verify your account." 
    };
    
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Something went wrong during registration." };
  }
}