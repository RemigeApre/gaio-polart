import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calligraphic = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-calligraphic",
  weight: ["300", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Gaio Polart — Volailles & Gibier de qualité",
  description:
    "Retrouvez Gaio Polart sur les marchés d'Île-de-France. Volailles fermières Label Rouge, gibier français, produits frais et de qualité.",
  keywords: [
    "volaille",
    "gibier",
    "marché",
    "Gaio Polart",
    "Label Rouge",
    "poulet fermier",
    "Gagny",
    "Chelles",
    "Meaux",
    "Villeparisis",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${calligraphic.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
