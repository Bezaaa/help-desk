import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) redirect("/login?error=InvalidToken");

  const user = await db.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) redirect("/login?error=UserNotFound");

  await db.user.update({
    where: { id: user.id },
    data: { 
      isVerified: true,
      verificationToken: null, 
    },
  });


  redirect("/login?verified=true");
}