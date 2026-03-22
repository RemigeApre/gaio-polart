import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et RGPD du site Gaio Polart.",
  robots: { index: false, follow: false },
};

export default function Confidentialite() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 pt-8 pb-12">
          <h1 className="text-2xl font-bold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-main)" }}>
            Politique de confidentialité
          </h1>
          <p className="text-[12px] mb-8" style={{ color: "var(--text-muted)" }}>
            Dernière mise à jour : mars 2026
          </p>

          <div className="space-y-8 text-[14px] leading-[1.8]" style={{ color: "var(--text-muted)" }}>
            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Responsable du traitement</h2>
              <p>
                <strong style={{ color: "var(--text-main)" }}>Gaio Polart SAS</strong>, éditeur du site gaio-polart.legeai-informatique.fr, est responsable du traitement des données au sens du Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Données collectées</h2>
              <p className="mb-3">
                Ce site a été conçu pour <strong style={{ color: "var(--text-main)" }}>minimiser la collecte de données</strong>. Voici ce que nous utilisons :
              </p>

              <div className="space-y-3">
                <div className="card px-4 py-3">
                  <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-main)" }}>Stockage local (localStorage)</p>
                  <ul className="text-[13px] space-y-1 list-disc list-inside">
                    <li>Préférence de thème (clair / sombre)</li>
                    <li>Liste de courses (articles, historique, listes récurrentes)</li>
                    <li>Acceptation du bandeau d&apos;information</li>
                  </ul>
                  <p className="text-[12px] mt-2 italic">
                    Ces données restent exclusivement sur votre appareil. Elles ne sont jamais transmises à nos serveurs ni à des tiers.
                  </p>
                </div>

                <div className="card px-4 py-3">
                  <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-main)" }}>Cookie de session (espace équipe)</p>
                  <ul className="text-[13px] space-y-1 list-disc list-inside">
                    <li>Un cookie httpOnly (<code className="text-[12px] px-1 py-0.5 rounded" style={{ backgroundColor: "var(--bg-body)" }}>gp_session</code>) est utilisé uniquement pour l&apos;authentification de l&apos;espace de gestion interne</li>
                    <li>Durée : 90 jours</li>
                    <li>Ce cookie n&apos;est pas utilisé pour le suivi ni la publicité</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Ce que nous ne faisons pas</h2>
              <ul className="space-y-1.5">
                {[
                  "Aucun cookie de tracking ou de publicité",
                  "Aucun outil d'analyse tiers (pas de Google Analytics, pas de Meta Pixel)",
                  "Aucune collecte d'adresse IP à des fins de profilage",
                  "Aucune revente ou transmission de données à des tiers",
                  "Aucun formulaire de collecte de données personnelles",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong style={{ color: "var(--text-main)" }}>Droit d&apos;accès</strong> : savoir quelles données sont stockées</li>
                <li><strong style={{ color: "var(--text-main)" }}>Droit de suppression</strong> : effacer vos données à tout moment</li>
                <li><strong style={{ color: "var(--text-main)" }}>Droit de portabilité</strong> : récupérer vos données dans un format lisible</li>
              </ul>
              <p className="mt-3">
                Pour le stockage local, vous pouvez à tout moment supprimer vos données en vidant le cache de votre navigateur ou en utilisant les outils de développement.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Hébergement</h2>
              <p>
                Le site est hébergé par <strong style={{ color: "var(--text-main)" }}>OVH SAS</strong> (2 rue Kellermann, 59100 Roubaix, France). Les données de session des utilisateurs authentifiés sont stockées dans une base de données hébergée sur le même serveur.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Contact</h2>
              <p>
                Pour toute question relative à la protection de vos données, vous pouvez nous contacter directement sur l&apos;un de nos marchés ou via les coordonnées disponibles sur le site.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
