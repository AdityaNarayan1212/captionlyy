import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { CaptionlyProvider } from "@/context/captionly-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Captionly — AI Social Media Captions",
  description:
    "Upload photos. Match the vibe. Post like a main character. AI-powered caption generator with mood analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <TooltipProvider>
          <CaptionlyProvider>
            <div className="mesh-gradient min-h-screen">
              <Navbar />
              <main className="pt-28 sm:pt-24 pb-16 px-4">
                <div className="mx-auto max-w-6xl">{children}</div>
              </main>
            </div>
            <Toaster position="bottom-center" richColors />
          </CaptionlyProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
