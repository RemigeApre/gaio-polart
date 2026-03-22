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
  title: {
    default: "Gaio Polart — Volailles & Gibier sur les marchés d'Île-de-France",
    template: "%s — Gaio Polart",
  },
  description:
    "Gaio Polart, votre volailler sur les marchés d'Île-de-France depuis 2006. Poulet fermier Label Rouge, gibier français, élevage plein air. Retrouvez-nous à Gagny, Chelles, Meaux et Villeparisis.",
  keywords: [
    "volaille marché Île-de-France",
    "volailler marché",
    "poulet fermier Label Rouge",
    "gibier français",
    "Gaio Polart",
    "marché Gagny",
    "marché Chelles",
    "marché Meaux",
    "marché Villeparisis",
    "volaille plein air",
    "volailler Seine-et-Marne",
    "volailler Seine-Saint-Denis",
    "poulet fermier marché",
    "gibier marché Île-de-France",
    "boucherie volaille marché",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gaio-polart.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Gaio Polart",
    title: "Gaio Polart — Volailles & Gibier sur les marchés d'Île-de-France",
    description:
      "Volailler depuis 2006. Poulet fermier Label Rouge, gibier français. Retrouvez-nous sur les marchés de Gagny, Chelles, Meaux et Villeparisis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gaio Polart — Volailles & Gibier de qualité",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaio Polart — Volailles & Gibier",
    description:
      "Volailler sur les marchés d'Île-de-France depuis 2006. Poulet fermier Label Rouge, gibier français.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${calligraphic.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Gaio Polart",
              description:
                "Volailler sur les marchés d'Île-de-France depuis 2006. Poulet fermier Label Rouge, gibier français, élevage plein air.",
              foundingDate: "2006",
              areaServed: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 48.88,
                  longitude: 2.58,
                },
                geoRadius: "30000",
              },
              address: {
                "@type": "PostalAddress",
                addressRegion: "Île-de-France",
                addressCountry: "FR",
              },
              priceRange: "€€",
              image: "/og-image.png",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://gaio-polart.fr",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
