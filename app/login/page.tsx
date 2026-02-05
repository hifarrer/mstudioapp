"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const urlError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlError === "CredentialsSignin") {
      setError("Invalid email or password.");
    }
  }, [urlError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: true,
      });
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-neutral-white mb-2">
            Log in to Cadenze Studio
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Enter your credentials to access your dashboard.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                {error}
              </div>
            )}
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
                autoComplete="current-password"
                className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-clay-500 hover:bg-accent-clay-300 disabled:opacity-60 disabled:pointer-events-none text-neutral-white font-medium py-3 rounded-md transition-colors"
            >
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>
          <p className="mt-6 text-center text-neutral-500 text-sm">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-accent-clay-300 hover:text-accent-clay-100"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-neutral-500">Loading…</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
