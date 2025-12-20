import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schema";


export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await db.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    
    async jwt({ token }) {
      if (!token.sub) return token;

   
      const existingUser = await db.user.findUnique({ 
        where: { id: token.sub } 
      });

      if (!existingUser) return token;

   
      token.role = existingUser.role;
      return token;
    },
 
    async session({ session, token }) {
      if (token.role && session.user) {
       
        session.user.role = token.role;
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});