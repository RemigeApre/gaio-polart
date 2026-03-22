import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
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
    "Gaio Polart, volailler sur les marchés d'Île-de-France depuis 2006. Poulet fermier Label Rouge, dinde, lapin, gibier français, élevage plein air et en liberté. Marchés de Gagny, Chelles, Meaux et Villeparisis en Seine-et-Marne et Seine-Saint-Denis.",
  keywords: [
    "volailler marché",
    "volailler Île-de-France",
    "volailler Seine-et-Marne",
    "volailler Seine-Saint-Denis",
    "volailler 77",
    "volailler 93",
    "volaille marché Île-de-France",
    "poulet fermier Label Rouge",
    "poulet fermier marché",
    "poulet fermier Île-de-France",
    "poulet plein air marché",
    "gibier français",
    "gibier marché Île-de-France",
    "gibier Seine-et-Marne",
    "dinde fermière marché",
    "lapin fermier marché",
    "volaille plein air",
    "volaille fermière",
    "Gaio Polart",
    "marché Gagny volaille",
    "marché Chelles volaille",
    "marché Meaux volaille",
    "marché Villeparisis volaille",
    "volailler Gagny",
    "volailler Chelles",
    "volailler Meaux",
    "volailler Villeparisis",
    "boucherie volaille marché",
    "poulet fermier Gagny",
    "poulet fermier Chelles",
    "poulet fermier Meaux",
    "gibier Chelles",
    "gibier Meaux",
    "commande volaille marché",
    "réservation volaille",
    "foie gras marché",
    "chapon marché Île-de-France",
    "oeufs fermiers marché",
    "brochette volaille marché",
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
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify((() => {
              const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaio-polart.fr";
              const sharedProps = {
                "@type": "LocalBusiness" as const,
                "@context": "https://schema.org",
                legalName: "Gaio Polart SAS",
                foundingDate: "2006",
                image: siteUrl + "/og-image.png",
                url: siteUrl,
                priceRange: "€€",
                paymentAccepted: ["Cash", "Credit Card"],
                currenciesAccepted: "EUR",
                knowsAbout: ["Volaille fermière", "Gibier français", "Label Rouge", "Élevage plein air", "Vente directe"],
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Volailles, gibier et préparations",
                  itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Poulet fermier Label Rouge" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Dinde fermière" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Lapin fermier" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Coq" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Poule" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Pintade" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Chapon" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Oeufs fermiers" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Foie gras" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Gibier de saison" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Lièvre" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Brochettes de volaille" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Aiguillettes" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Émincé de volaille" } },
                  ],
                },
              };
              return [
                // Marché de Gagny
                {
                  ...sharedProps,
                  "@id": siteUrl + "/#marche-gagny",
                  name: "Gaio Polart — Marché de Gagny",
                  description: "Volailler au marché de Gagny chaque samedi. Poulet fermier Label Rouge, gibier français, oeufs fermiers. Élevage plein air, 100% viande française.",
                  address: { "@type": "PostalAddress", addressLocality: "Gagny", postalCode: "93220", addressRegion: "Seine-Saint-Denis", addressCountry: "FR" },
                  geo: { "@type": "GeoCoordinates", latitude: 48.8836, longitude: 2.5344 },
                  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "07:30", closes: "13:00" }],
                },
                // Marché de Chelles
                {
                  ...sharedProps,
                  "@id": siteUrl + "/#marche-chelles",
                  name: "Gaio Polart — Marché de Chelles",
                  description: "Volailler au marché de Chelles, mardi, jeudi et dimanche. Poulet fermier Label Rouge, dinde, lapin, gibier de saison. Élevage fermier et plein air.",
                  address: { "@type": "PostalAddress", addressLocality: "Chelles", postalCode: "77500", addressRegion: "Seine-et-Marne", addressCountry: "FR" },
                  geo: { "@type": "GeoCoordinates", latitude: 48.8829, longitude: 2.5935 },
                  openingHoursSpecification: [
                    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "07:30", closes: "13:00" },
                    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "07:30", closes: "13:00" },
                    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "07:30", closes: "13:00" },
                  ],
                },
                // Marché de Meaux
                {
                  ...sharedProps,
                  "@id": siteUrl + "/#marche-meaux",
                  name: "Gaio Polart — Marché de Meaux",
                  description: "Volailler au marché de Meaux chaque samedi. Poulet fermier Label Rouge, gibier français, foie gras, préparations maison. 100% viande française.",
                  address: { "@type": "PostalAddress", addressLocality: "Meaux", postalCode: "77100", addressRegion: "Seine-et-Marne", addressCountry: "FR" },
                  geo: { "@type": "GeoCoordinates", latitude: 48.9604, longitude: 2.8786 },
                  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "07:30", closes: "13:00" }],
                },
                // Marché de Villeparisis
                {
                  ...sharedProps,
                  "@id": siteUrl + "/#marche-villeparisis",
                  name: "Gaio Polart — Marché de Villeparisis",
                  description: "Volailler au marché de Villeparisis, vendredi et dimanche. Poulet fermier, volailles fermières Label Rouge, gibier de saison. Élevage plein air.",
                  address: { "@type": "PostalAddress", addressLocality: "Villeparisis", postalCode: "77270", addressRegion: "Seine-et-Marne", addressCountry: "FR" },
                  geo: { "@type": "GeoCoordinates", latitude: 48.9450, longitude: 2.6133 },
                  openingHoursSpecification: [
                    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "07:30", closes: "13:00" },
                    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "07:30", closes: "13:00" },
                  ],
                },
                // FAQ
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "Où trouver le volailler Gaio Polart sur les marchés d'Île-de-France ?",
                      acceptedAnswer: { "@type": "Answer", text: "Gaio Polart est présent sur les marchés de Gagny (samedi), Chelles (mardi, jeudi, dimanche), Meaux (samedi) et Villeparisis (vendredi, dimanche), de 7h30 à 13h00. Tous en Seine-et-Marne et Seine-Saint-Denis." },
                    },
                    {
                      "@type": "Question",
                      name: "Quels produits de volaille et gibier propose Gaio Polart ?",
                      acceptedAnswer: { "@type": "Answer", text: "Poulet fermier Label Rouge, dinde, lapin, coq, poule, pintade, chapon, oeufs fermiers, foie gras, gibier de saison (lièvre, etc.), et des préparations maison : brochettes, aiguillettes, émincé. 100% viande française, élevage fermier et plein air." },
                    },
                    {
                      "@type": "Question",
                      name: "Comment commander ou réserver de la volaille chez Gaio Polart ?",
                      acceptedAnswer: { "@type": "Answer", text: "Les réservations et commandes sont possibles par téléphone, par email ou directement sur place au marché. Recommandé pour les pièces entières, le gibier de saison et les préparations spéciales, afin de garantir la disponibilité et limiter le gaspillage." },
                    },
                    {
                      "@type": "Question",
                      name: "Gaio Polart accepte-t-il la carte bancaire au marché ?",
                      acceptedAnswer: { "@type": "Answer", text: "Oui, Gaio Polart accepte les paiements par carte bancaire et en espèces sur tous ses marchés." },
                    },
                    {
                      "@type": "Question",
                      name: "D'où vient la volaille de Gaio Polart ?",
                      acceptedAnswer: { "@type": "Answer", text: "100% de la viande est française, issue d'élevages fermiers, plein air et en liberté. Les volailles sont certifiées Label Rouge. L'entreprise privilégie le respect animal et les circuits courts depuis 2006." },
                    },
                    {
                      "@type": "Question",
                      name: "Où acheter du poulet fermier Label Rouge à Gagny, Chelles, Meaux ou Villeparisis ?",
                      acceptedAnswer: { "@type": "Answer", text: "Gaio Polart propose du poulet fermier Label Rouge sur les marchés de Gagny (samedi), Chelles (mardi, jeudi, dimanche), Meaux (samedi) et Villeparisis (vendredi, dimanche), de 7h30 à 13h00." },
                    },
                  ],
                },
              ];
            })()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <ThemeProvider>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
