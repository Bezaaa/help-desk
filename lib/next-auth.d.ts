import { Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

// This is the magic part. We are expanding the existing types.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role; // This pulls the Role enum (ADMIN/USER) from your Prisma schema
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}