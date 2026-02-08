import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navBar";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";
import Providers from "@/components/auth/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Lazy-load analytics components only in the browser
const Analytics = dynamic(
  () => import("@vercel/analytics/react").then(mod => mod.Analytics)
);
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then(mod => mod.SpeedInsights)
);

export const metadata: Metadata = {
  title: "Dead & Injured Game",
  description: "Guess the number in a game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`relative min-h-screen ${geistSans.variable} ${geistMono.variable} font-sans`}
      >
        <div
          className="fixed top-0 left-0 min-w-screen min-h-screen bg-cover bg-center bg-no-repeat opacity-20 z-0"
          style={{ backgroundImage: "url('/images/logo.png')" }}
        />
        <div className="relative z-10 flex flex-col min-h-screen bg-white/80 ">
          <NavBar />

          <main className="flex-grow flex justify-center items-center">
            <Providers>            
              {children}
            </Providers>
          </main>
          <Toaster position="top-center" className="relative z-100" />
          {/* Footer */}
          <footer className="w-full h-24 justify-items-center p-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
            <div className="text-sm text-gray-500">
              © 2025 Margaret C. Arukwe. All rights reserved.
            </div>
          </footer>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
