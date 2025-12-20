/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  try {
 
    const data = Object.fromEntries(formData);

    await signIn("credentials", {
      ...data,
      redirectTo: "/dashboard", 
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error; 
  }
}