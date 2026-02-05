"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? { _: ["Registration failed."] });
        setLoading(false);
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError({ _: ["Something went wrong. Please try again."] });
      setLoading(false);
    }
  }

  const flatError = Object.values(error).flat().join(" ");

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-neutral-white mb-2">
            Create your account
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Sign up to start using Cadenze Studio.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {flatError && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                {flatError}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-300 mb-1"
              >
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500"
                placeholder="you@example.com"
              />
              {error.email && (
                <p className="mt-1 text-red-400 text-xs">{error.email[0]}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500"
                placeholder="At least 8 characters"
              />
              {error.password && (
                <p className="mt-1 text-red-400 text-xs">
                  {error.password[0]}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-clay-500 hover:bg-accent-clay-300 disabled:opacity-60 disabled:pointer-events-none text-neutral-white font-medium py-3 rounded-md transition-colors"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-center text-neutral-500 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent-clay-300 hover:text-accent-clay-100"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
