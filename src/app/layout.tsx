import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Providers } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Employee of the Month Portal",
  description:
    "Recognize excellence. Celebrate achievement. Inspire greatness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-layer-0 text-foreground`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Providers>
            <AuthGuard>{children}</AuthGuard>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
