import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ReactQueryProvider } from "@/app/_shared/components/ReactQueryProvider";
import { Toaster } from "@/app/_shared/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZEMTORI",
  description: "Build your online store and ship faster with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <ClerkProvider dynamic>
        <ReactQueryProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased`}
            >
              {children}
              <Toaster />
            </body>
          </html>
        </ReactQueryProvider>
      </ClerkProvider>
    </NuqsAdapter>
  );
}
