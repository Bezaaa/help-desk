import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { GlobalSyncProvider } from "@/components/providers/GlobalSyncProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: 'Help Desk',
  description:
    'A help-desk application to manage support tickets.',
  keywords: [
    'Help desk',
    'Dashboard',
    'Tickets',
    'Ticket Management',
    'It Support',
  ],
  authors: [{ name: 'Coalition Technologies Candidate' }],
  icons: {
    icon: '/TestLogo.svg',
  },

  openGraph: {
    title: 'Tech.Care Dashboard',
    description: 'View patient vitals and diagnosis history.',
    type: 'website',
    siteName: 'Tech.Care',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalSyncProvider/>
        {children}
          <Toaster richColors position="top-center" /> 
      </body>
    </html>
  );
}
