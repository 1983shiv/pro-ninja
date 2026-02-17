import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { MarketingHeader } from "@/components/layout/marketing-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI ReviewSense - Automate Customer Reviews with AI",
  description: "Analyze, respond, and learn from customer feedback instantly using GPT-4, Claude, and more. Built for WordPress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col bg-linear-to-b from-white to-slate-50">
            <MarketingHeader />
            <main className="grow pt-[72px] relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 hero-pattern pointer-events-none z-0"></div>
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/50 to-slate-50 pointer-events-none z-0"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

