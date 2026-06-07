import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import { SimulationProvider } from "@/context/SimulationContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediAción - Acuerdos Inteligentes",
  description: "Plataforma de mediación neutral asistida por IA para convenios reguladores de mutuo acuerdo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-bg text-brand-text flex flex-col font-sans">
        <SimulationProvider>
          {children}
        </SimulationProvider>
      </body>
    </html>
  );
}
