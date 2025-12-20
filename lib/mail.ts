import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;


  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your HelpDesk account",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
  });
};




export const sendVerifiedNotificationEmail = async (email: string, name: string) => {
  await resend.emails.send({
    from: "support@resend.dev", 
    to: email,
    subject: "Account Verified - HelpDesk Hub",
    html: `
      <div style="font-family: sans-serif; background-color: #09090b; color: #fafafa; padding: 40px; border-radius: 10px;">
        <h1 style="color: #6366f1;">Hello, ${name}!</h1>
        <p style="font-size: 16px; color: #a1a1aa;">Great news! Your account has been manually verified by an administrator.</p>
        <p style="font-size: 16px; color: #a1a1aa;">You now have full access to create and manage support tickets.</p>
        <div style="margin-top: 30px;">
          <a href="http://localhost:3000/dashboard" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Enter Dashboard</a>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #71717a;">System: Operations Hub // Identity Verified</p>
      </div>
    `
  });
};


export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your Password",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
    `,
  });
};