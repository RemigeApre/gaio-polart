import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Connexion",
  description: "Espace réservé à l'équipe Gaio Polart.",
};

export default async function ConnexionPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Monogramme GP en fond */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
        style={{ color: "var(--text-main)", opacity: 0.02 }}
        aria-hidden="true"
      >
        GP
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full border border-or/30 flex items-center justify-center bg-or/[0.07] mx-auto mb-5">
            <span className="text-or text-2xl font-bold font-[family-name:var(--font-calligraphic)] italic">G</span>
          </div>
          <h1 className="text-xl font-light tracking-[0.25em] uppercase" style={{ color: "var(--text-main)" }}>
            Gaio Polart
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1.5" style={{ color: "var(--text-muted)" }}>
            Espace équipe
          </p>
        </div>

        {/* Formulaire */}
        <LoginForm />

        {/* Retour */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-[12px] tracking-wide uppercase hover:text-or transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
