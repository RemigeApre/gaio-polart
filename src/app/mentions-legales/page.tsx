import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Gaio Polart.",
  robots: { index: false, follow: false },
};

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-5 pt-8 pb-12">
          <h1 className="text-2xl font-bold uppercase tracking-[0.1em] mb-6" style={{ color: "var(--text-main)" }}>
            Mentions légales
          </h1>

          <div className="space-y-8 text-[14px] leading-[1.8]" style={{ color: "var(--text-muted)" }}>
            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Éditeur du site</h2>
              <p>
                <strong style={{ color: "var(--text-main)" }}>Gaio Polart SAS</strong>
                <br />
                Commerce de volailles et gibier sur les marchés d&apos;Île-de-France
                <br />
                Depuis 2006
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Hébergement</h2>
              <p>
                <strong style={{ color: "var(--text-main)" }}>OVH SAS</strong>
                <br />
                2 rue Kellermann, 59100 Roubaix, France
                <br />
                RCS Lille Métropole 424 761 419 00045
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Conception et développement</h2>
              <p>
                <strong style={{ color: "var(--text-main)" }}>Le Geai</strong>
                <br />
                <a href="https://legeai-informatique.fr" target="_blank" rel="noopener noreferrer" className="text-or hover:text-or-light transition-colors">
                  legeai-informatique.fr
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, logo, mise en page) est la propriété de Gaio Polart SAS ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Responsabilité</h2>
              <p>
                Les informations présentes sur ce site sont fournies à titre indicatif. Gaio Polart s&apos;efforce de maintenir les horaires et emplacements de marchés à jour, mais ne saurait être tenu responsable d&apos;éventuelles erreurs ou modifications de dernière minute.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-or">Données personnelles</h2>
              <p>
                Consultez notre{" "}
                <a href="/confidentialite" className="text-or hover:text-or-light transition-colors font-medium">
                  politique de confidentialité
                </a>{" "}
                pour en savoir plus sur le traitement de vos données.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
