import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "MediAción",
  description: "Mediación legal guiada para parejas en proceso de divorcio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased bg-slate-900`}
    >
      <body className="min-h-screen flex justify-center font-sans" suppressHydrationWarning>
        <div className="w-full max-w-md bg-brand-cream min-h-screen shadow-2xl relative overflow-x-hidden pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}
