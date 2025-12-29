import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Pacifico } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistPacifico = Geist({
  variable: "--font-geist-pacifico",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TownWrent",
  description: "Connecting tenants with verified properties.",
  icons: {
    icon: [
      { url: "/logos/wrent1.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/logos/wrent1.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistPacifico.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}