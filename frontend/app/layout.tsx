import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "U-ETDS Otomasyonu",
  description: "Byzon Technologies U-ETDS Sefer Otomasyon Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable}`}>
      <body className="antialiased min-h-screen selection:bg-primary-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
