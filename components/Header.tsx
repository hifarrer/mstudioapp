"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="topbar relative z-50 pt-[18px] pb-3.5">
      <div className="wrap max-w-cadenze mx-auto px-6">
        <div className="row grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link
            href="/"
            className="logo tracking-[0.18em] font-semibold text-lg opacity-95"
          >
            CADENZE
          </Link>

          <nav className="nav hidden lg:flex gap-[26px] justify-center text-sm text-[var(--muted)]" aria-label="Primary">
            <Link href="/#product" className="opacity-90 hover:opacity-100 hover:text-[var(--text)] transition-opacity">
              Product
            </Link>
            <Link href="/#how" className="opacity-90 hover:opacity-100 hover:text-[var(--text)] transition-opacity">
              How it works
            </Link>
            <Link href="/#pricing" className="opacity-90 hover:opacity-100 hover:text-[var(--text)] transition-opacity">
              Pricing
            </Link>
          </nav>

          <div className="right flex justify-end">
            {status === "loading" ? (
              <span className="text-[var(--muted2)] text-sm">...</span>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="btn btn-ghost mr-2 rounded-full border border-[var(--stroke2)] px-[18px] py-3 text-sm font-semibold bg-white/5 text-[rgba(239,232,228,.88)] hover:-translate-y-px transition-transform"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-ghost rounded-full border border-[var(--stroke2)] px-[18px] py-3 text-sm font-semibold bg-white/5 text-[rgba(239,232,228,.88)] hover:-translate-y-px transition-transform"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-ghost mr-2 rounded-full border border-[var(--stroke2)] px-[18px] py-3 text-sm font-semibold bg-white/5 text-[rgba(239,232,228,.88)] hover:-translate-y-px transition-transform"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary inline-flex items-center justify-center rounded-full border border-white/10 px-[18px] py-3 text-sm font-semibold bg-gradient-to-b from-[var(--orange1)] to-[var(--orange2)] shadow-[0_14px_40px_rgba(209,123,80,.2)] hover:opacity-95 hover:-translate-y-px transition-all"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
        <div
          className="hairline h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-3.5 opacity-85"
          aria-hidden
        />
      </div>
    </header>
  );
}
