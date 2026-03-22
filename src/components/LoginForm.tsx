"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Impossible de se connecter. Vérifiez votre connexion.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card rounded-2xl px-7 sm:px-8 py-8 space-y-5">
        {error && (
          <div className="text-[13px] text-center py-3 px-4 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-red-400 font-medium">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-[12px] uppercase tracking-[0.1em] mb-2 font-semibold"
            style={{ color: "var(--text-main)" }}
          >
            Identifiant
          </label>
          <div className="relative">
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)", opacity: 0.5 }}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[15px] outline-none border-2 transition-colors focus:border-or/50"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-main)",
                color: "var(--text-main)",
              }}
              placeholder="Votre identifiant"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[12px] uppercase tracking-[0.1em] mb-2 font-semibold"
            style={{ color: "var(--text-main)" }}
          >
            Mot de passe
          </label>
          <div className="relative">
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)", opacity: 0.5 }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full pl-11 pr-12 py-3.5 rounded-xl text-[15px] outline-none border-2 transition-colors focus:border-or/50"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-main)",
                color: "var(--text-main)",
              }}
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-or/10 transition-colors"
              style={{ color: "var(--text-muted)" }}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim() || !password.trim()}
          className="w-full py-3.5 rounded-xl text-[14px] font-bold uppercase tracking-[0.1em] bg-or text-noir-light hover:bg-or-light disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connexion...
            </span>
          ) : (
            "Se connecter"
          )}
        </button>
      </div>
    </form>
  );
}
