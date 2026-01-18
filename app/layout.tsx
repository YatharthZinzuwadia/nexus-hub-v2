import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusHub v2 | Developer Operating System",
  description: "Your unified developer workspace with AI-powered intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ThemeProvider: Manages dark/light mode */}
        <ThemeProvider>
          {/* AuthProvider: Syncs Supabase session with Zustand */}
          <AuthProvider>
            {children}
            {/* Sonner: Toast notifications for auth feedback */}
            <Toaster position="top-right" richColors closeButton theme="dark" />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
