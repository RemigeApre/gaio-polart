"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "text-or",
  DIRECTION: "text-green-400",
  VIEWER: "text-blanc/50",
};

export function DashboardHome({ user }: { user: DashboardUser }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const isAdmin = user.role === "ADMIN";
  const isDirection = user.role === "DIRECTION";
  const canManage = isAdmin || isDirection;

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
            <a href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-or/30 flex items-center justify-center bg-or/[0.07]">
                <span className="text-or text-base font-bold font-[family-name:var(--font-calligraphic)] italic">G</span>
              </div>
              <div>
                <span className="text-[14px] text-blanc/90 font-light tracking-[0.22em] uppercase">
                  Gaio Polart
                </span>
                <span className="text-blanc/30 text-[10px] tracking-wide ml-2">
                  Dashboard
                </span>
              </div>
            </a>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* User info */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blanc/10 flex items-center justify-center">
                  <span className="text-blanc/70 text-[13px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-blanc/80 text-[13px] font-semibold">{user.name}</p>
                  <p className={`text-[10px] uppercase tracking-widest font-medium ${ROLE_COLORS[user.role] || "text-blanc/40"}`}>
                    {ROLE_LABELS[user.role] || user.role}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href="/"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-blanc/10 text-blanc/40 hover:text-blanc/70 hover:border-blanc/20 transition-colors"
                  title="Voir le site"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-blanc/10 text-blanc/40 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                  title="Déconnexion"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-5xl mx-auto px-5 py-8 sm:py-12">
          {/* Accueil */}
          <div className="mb-10">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--text-main)" }}
            >
              Bonjour, {user.name}
            </h1>
            <p className="text-[14px] mt-1.5" style={{ color: "var(--text-muted)" }}>
              Gérez vos marchés, absences et informations.
            </p>
          </div>

          {/* Grille d'actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {canManage && (
              <>
                <DashboardCard
                  title="Absences"
                  description="Signaler ou annuler une absence sur un marché"
                  href="/dashboard/absences"
                  color="#ef4444"
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="10" y1="14" x2="14" y2="18" />
                      <line x1="14" y1="14" x2="10" y2="18" />
                    </svg>
                  }
                />
                <DashboardCard
                  title="Marchés"
                  description="Gérer les marchés, horaires et adresses"
                  href="/dashboard/marches"
                  color="#3b82f6"
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  soon
                />
              </>
            )}

            {isAdmin && (
              <DashboardCard
                title="Utilisateurs"
                description="Gérer les comptes et les accès"
                href="/dashboard/utilisateurs"
                color="#a855f7"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
                soon
              />
            )}
          </div>

          {/* Raccourcis */}
          <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border-main)" }}>
            <h2 className="text-[12px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              Raccourcis
            </h2>
            <div className="flex flex-wrap gap-2">
              <QuickLink href="/" label="Voir le site" />
              <QuickLink href="/marches" label="Page marchés" />
              <QuickLink href="/liste-de-courses" label="Liste de courses" />
            </div>
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
  color,
  soon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  soon?: boolean;
}) {
  const content = (
    <div
      className={`card px-5 py-5 flex items-start gap-4 group transition-all ${
        soon ? "opacity-45 cursor-not-allowed" : "hover:shadow-lg cursor-pointer"
      }`}
      style={!soon ? { borderColor: "transparent" } : {}}
      onMouseEnter={(e) => { if (!soon) (e.currentTarget.style.borderColor = color + "40"); }}
      onMouseLeave={(e) => { if (!soon) (e.currentTarget.style.borderColor = "transparent"); }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + "12", color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold" style={{ color: "var(--text-main)" }}>
            {title}
          </h3>
          {soon && (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: color + "12", color }}>
              Bientôt
            </span>
          )}
        </div>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      </div>
      {!soon && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0 mt-1 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "var(--text-muted)" }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </div>
  );

  if (!soon) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-or/10 hover:text-or"
      style={{ color: "var(--text-muted)", border: "1px solid var(--border-main)" }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      {label}
    </a>
  );
}
