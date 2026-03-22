import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingListPage } from "@/components/ShoppingListPage";
import { ShareButton } from "@/components/ShareButton";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaio-polart.fr";

export const metadata: Metadata = {
  title: "Liste de courses gratuite en ligne — Marché, courses, commissions",
  description:
    "Liste de courses gratuite, simple et rapide. Préparez vos courses pour le marché depuis votre téléphone. Sans inscription, sans pub. Cochez, ajoutez, partagez. Fonctionne hors ligne.",
  keywords: [
    "liste de courses gratuite",
    "liste de courses en ligne",
    "liste de courses marché",
    "liste de courses téléphone",
    "liste de courses simple",
    "liste de courses sans inscription",
    "liste courses gratuite mobile",
    "application liste de courses gratuite",
    "faire sa liste de courses",
    "liste de courses hors ligne",
    "liste commissions marché",
    "préparer ses courses marché",
    "liste courses volaille",
    "liste courses marché Île-de-France",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Gaio Polart",
    title: "Liste de courses gratuite — Simple, rapide, sans inscription",
    description:
      "Préparez votre liste de courses pour le marché. Gratuite, sans inscription, sans pub. Sauvegardée sur votre téléphone.",
    url: `${siteUrl}/liste-de-courses`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Liste de courses gratuite — Gaio Polart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liste de courses gratuite — Sans inscription, sans pub",
    description:
      "Préparez vos courses pour le marché. Ajoutez, cochez, partagez. Gratuite et sauvegardée sur votre téléphone.",
  },
  alternates: {
    canonical: "/liste-de-courses",
  },
};

export default function ListeDeCourses() {
  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
          style={{ color: "var(--text-main)", opacity: 0.02 }}
          aria-hidden="true"
        >
          GP
        </div>
        <div className="relative z-10">
          <ShoppingListPage />
        </div>
      </main>
      <Footer />
      <ShareButton />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Liste de courses gratuite — Gaio Polart",
              description:
                "Application de liste de courses gratuite, simple et rapide. Sans inscription, sans pub. Fonctionne sur téléphone et hors ligne. Idéale pour préparer ses courses au marché.",
              url: `${siteUrl}/liste-de-courses`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
              featureList: [
                "Liste de courses gratuite",
                "Sans inscription",
                "Sans publicité",
                "Sauvegarde automatique",
                "Fonctionne hors ligne",
                "Cocher les articles achetés",
                "Historique des suppressions",
                "Compatible mobile et ordinateur",
              ],
              browserRequirements: "Requires JavaScript",
              softwareVersion: "1.0",
              author: {
                "@type": "Organization",
                name: "Gaio Polart",
                url: siteUrl,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Comment utiliser la liste de courses gratuite ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tapez le nom d'un article et appuyez sur Entrée ou le bouton Ajouter. Cochez les articles au fur et à mesure. Votre liste est automatiquement sauvegardée sur votre appareil, sans inscription.",
                  },
                },
                {
                  "@type": "Question",
                  name: "La liste de courses fonctionne-t-elle hors ligne ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Oui, une fois la page chargée, votre liste est sauvegardée sur votre appareil et reste accessible même sans connexion internet.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Peut-on récupérer des articles supprimés par erreur ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Oui, tous les articles supprimés sont conservés dans un historique. Vous pouvez les restaurer à tout moment en un clic.",
                  },
                },
              ],
            },
          ]),
        }}
      />
    </>
  );
}
