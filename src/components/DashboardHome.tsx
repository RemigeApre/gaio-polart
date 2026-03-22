"use client";

import { useRouter } from "next/navigation";

interface DashboardUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  DIRECTION: "Direction",
  VIEWER: "Consultation",
};

export function DashboardHome({ user }: { user: DashboardUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* GP fond */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
        style={{ color: "var(--text-main)", opacity: 0.02 }}
        aria-hidden="true"
      >
        GP
      </div>

      <div className="relative z-10">
        {/* Top bar */}
        <div className="bg-noir border-b border-blanc/[0.06]">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="group flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-or/30 flex items-center justify-center bg-or/[0.07]">
                  <span className="text-or text-base font-bold font-[family-name:var(--font-calligraphic)] italic">G</span>
                </div>
                <div>
                  <span className="text-[14px] text-blanc/90 font-light tracking-[0.22em] uppercase">
                    Dashboard
                  </span>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-blanc/70 text-[13px] font-medium">{user.name}</p>
                <p className="text-blanc/30 text-[10px] uppercase tracking-widest">
                  {ROLE_LABELS[user.role] || user.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-[11px] uppercase tracking-wide text-blanc/40 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-blanc/10 hover:border-red-400/30"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div className="mb-10">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--text-main)" }}
            >
              Bonjour, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              Bienvenue sur votre espace de gestion.
            </p>
          </div>

          {/* Grille d'actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(user.role === "ADMIN" || user.role === "DIRECTION") && (
              <>
                <DashboardCard
                  title="Marchés"
                  description="Gérer les marchés, horaires et adresses"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  soon
                />
                <DashboardCard
                  title="Absences"
                  description="Signaler une absence sur un marché"
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="10" y1="14" x2="14" y2="18" />
                      <line x1="14" y1="14" x2="10" y2="18" />
                    </svg>
                  }
                  soon
                />
              </>
            )}

            {user.role === "ADMIN" && (
              <DashboardCard
                title="Utilisateurs"
                description="Gérer les comptes et les accès"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                soon
              />
            )}

            <DashboardCard
              title="Retour au site"
              description="Voir le site public"
              href="/"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  href,
  soon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  soon?: boolean;
}) {
  const content = (
    <div
      className={`card px-6 py-5 flex items-start gap-4 ${
        soon ? "opacity-50 cursor-not-allowed" : "hover:border-or/30 cursor-pointer"
      }`}
    >
      <div className="text-or/70 mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-main)" }}
          >
            {title}
          </h3>
          {soon && (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-or/10 text-or font-medium">
              Bientôt
            </span>
          )}
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      </div>
    </div>
  );

  if (href && !soon) {
    return <a href={href}>{content}</a>;
  }

  return content;
}
