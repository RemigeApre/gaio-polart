"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div
        className="glass rounded-2xl border px-7 py-8 space-y-5"
        style={{ borderColor: "var(--border-main)", boxShadow: "0 0 80px -20px rgba(201, 168, 76, 0.06)" }}
      >
        {error && (
          <div className="text-sm text-center py-2.5 px-4 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-[11px] uppercase tracking-[0.12em] mb-2 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Identifiant
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
            className="w-full px-4 py-3 rounded-lg text-sm outline-none border transition-colors focus:border-or/50"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
            }}
            placeholder="Votre identifiant"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[11px] uppercase tracking-[0.12em] mb-2 font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 rounded-lg text-sm outline-none border transition-colors focus:border-or/50"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
            }}
            placeholder="Votre mot de passe"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-[13px] font-semibold uppercase tracking-[0.12em] bg-or text-noir-light hover:bg-or-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </form>
  );
}
