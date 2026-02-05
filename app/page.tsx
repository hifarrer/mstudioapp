import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative z-0 min-h-screen">
      {/* HERO */}
      <section className="hero pt-10 pb-6 md:pt-[42px] md:pb-6" id="product">
        <div className="wrap max-w-cadenze mx-auto px-6">
          <div className="heroGrid mt-4 md:mt-[18px] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-7 items-center">
            <div>
              <h1 className="m-0 mb-3.5 text-[2.75rem] md:text-[3.5rem] lg:text-[60px] font-medium tracking-[-0.04em] leading-[1.02]">
                Create in rhythm.
              </h1>
              <p className="lead m-0 mb-5 max-w-[54ch] text-[var(--muted)] text-base leading-[1.65]">
                Cadenze is an AI-assisted studio for producers,
                <br className="hidden sm:block" />
                and songwriters—built to spark ideas, shape drafts,
                <br className="hidden sm:block" />
                and keep momentum without breaking flow.
              </p>

              <div className="actions flex gap-3 flex-wrap mb-3.5">
                <Link
                  href="/register"
                  className="btn-primary inline-flex items-center justify-center rounded-full border border-white/10 px-[18px] py-3 text-sm font-semibold bg-gradient-to-b from-[var(--orange1)] to-[var(--orange2)] shadow-[0_14px_40px_rgba(209,123,80,.2)] hover:opacity-95 hover:-translate-y-px transition-all"
                >
                  Start a Session
                </Link>
                <Link
                  href="/login"
                  className="btn-ghost inline-flex items-center justify-center rounded-full border border-[var(--stroke2)] px-[18px] py-3 text-sm font-semibold bg-white/5 text-[rgba(239,232,228,.88)] hover:-translate-y-px transition-transform"
                >
                  Log in
                </Link>
                <Link
                  href="/#demo"
                  className="btn-ghost inline-flex items-center justify-center rounded-full border border-[var(--stroke2)] px-[18px] py-3 text-sm font-semibold bg-white/5 text-[rgba(239,232,228,.88)] hover:-translate-y-px transition-transform"
                >
                  Watch demo ▾
                </Link>
              </div>

              <div className="subline text-[var(--muted2)] text-[13px]">
                AI-assisted. Human-led.
              </div>
            </div>

            {/* Studio panel + prompt card (template) */}
            <div
              className="studio relative min-h-[220px] lg:min-h-[300px] rounded-[var(--radius2)] border border-white/10 overflow-hidden"
              style={{
                background:
                  "radial-gradient(600px 300px at 70% 10%, rgba(255,255,255,.05), transparent 62%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.16))",
                boxShadow: "0 24px 70px rgba(0,0,0,.55)",
              }}
              aria-label="Studio preview"
            >
              <div
                className="absolute inset-0 opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.15) 55%, rgba(0,0,0,.35)), radial-gradient(900px 400px at 70% 20%, rgba(209,123,80,.16), transparent 65%), radial-gradient(800px 500px at 10% 80%, rgba(255,255,255,.05), transparent 68%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.14] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                  backgroundSize: "46px 46px",
                  maskImage: "radial-gradient(closest-side at 62% 42%, black, transparent 72%)",
                }}
              />

              <div className="promptCard absolute right-4 top-12 lg:right-6 lg:top-[70px] w-[calc(100%-2rem)] lg:w-[360px] rounded-2xl border border-white/10 bg-[rgba(18,13,18,.78)] backdrop-blur-[10px] shadow-[0_18px_60px_rgba(0,0,0,.55)] overflow-hidden">
                <div className="inner p-4 pb-3">
                  <p className="promptTitle text-[13px] text-[rgba(239,232,228,.78)] m-0 mb-2.5">
                    Session prompt
                  </p>
                  <div className="promptBox rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-[1.45] text-[rgba(239,232,228,.86)] mb-3">
                    Let&apos;s create a dreamy, chill, lo-fi electric
                    <br />
                    piano riff with a trip hop beat.
                  </div>
                  <Link
                    href="/register"
                    className="promptBtn block w-full rounded-xl border border-white/10 py-3 px-3.5 text-center text-sm font-semibold bg-gradient-to-b from-[rgba(209,123,80,.95)] to-[rgba(184,98,61,.95)] hover:opacity-95 transition-opacity"
                  >
                    Start generating
                  </Link>

                  <div className="transport flex items-center gap-2.5 mt-3 pt-2.5 border-t border-white/10 text-[rgba(239,232,228,.55)] text-xs">
                    <div className="icons flex gap-2 items-center">
                      <span className="ic w-3.5 h-2.5 rounded-[3px] border border-white/20 bg-white/5" title="Prev" />
                      <span className="ic w-3.5 h-2.5 rounded-[3px] border border-white/20 bg-white/5" title="Play" />
                      <span className="ic w-3.5 h-2.5 rounded-[3px] border border-white/20 bg-white/5" title="Next" />
                      <span className="ic w-3.5 h-2.5 rounded-[3px] border border-white/20 bg-white/5" title="Loop" />
                    </div>
                    <div className="time ml-auto opacity-90">0:41</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="sectionLine h-px my-5 md:my-6 opacity-90"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent)",
            }}
          />

          {/* Trio */}
          <div className="trio grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 pt-2 pb-6">
            <div className="mini py-1.5">
              <h3 className="m-0 mb-2.5 font-medium text-[28px] tracking-[-0.02em]">
                Session
              </h3>
              <p className="m-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[34ch]">
                Start with a feeling,
                <br />
                a sound, or a concept.
              </p>
            </div>
            <div className="mini py-1.5">
              <h3 className="m-0 mb-2.5 font-medium text-[28px] tracking-[-0.02em]">
                Draft
              </h3>
              <p className="m-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[34ch]">
                Shape parts. Regenerate
                <br />
                what you need—nothing more.
              </p>
            </div>
            <div className="mini py-1.5">
              <h3 className="m-0 mb-2.5 font-medium text-[28px] tracking-[-0.02em]">
                Flow
              </h3>
              <p className="m-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[34ch]">
                Stay moving. Fewer
                <br />
                decisions, more momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how pt-6 pb-7" id="how">
        <div className="wrap max-w-cadenze mx-auto px-6">
          <div className="howHead flex items-end justify-between gap-4 mb-2.5">
            <h2 className="m-0 text-[30px] font-medium tracking-[-0.02em]">
              How it works
            </h2>
          </div>

          <div
            className="howDivider h-px my-3.5 md:my-4 opacity-90"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)",
            }}
          />

          <div className="howGrid grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-4 md:mb-[18px]">
            <div className="howItem">
              <h4 className="m-0 mb-2 text-lg font-medium tracking-[-0.01em]">
                Prompt
              </h4>
              <p className="m-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[38ch]">
                Describe the vibe, and
                <br />
                what you&apos;re after.
              </p>
            </div>
            <div className="howItem">
              <h4 className="m-0 mb-2 text-lg font-medium tracking-[-0.01em]">
                Build
              </h4>
              <p className="m-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[38ch]">
                Generate stems and
                <br />
                iterate by part.
              </p>
            </div>
            <div className="howItem">
              <h4 className="m-0 mb-2 text-lg font-medium tracking-[-0.01em]">
                Export
              </h4>
              <p className="m-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[38ch]">
                Take stems or MIDI into your
                <br />
                DAW.
              </p>
            </div>
          </div>

          <div className="shots grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5 md:gap-6" id="demo">
            <div
              className="shot rounded-[var(--radius2)] border border-white/10 min-h-[200px] relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(700px 220px at 35% 0%, rgba(209,123,80,.16), transparent 65%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.18))",
                boxShadow: "0 22px 60px rgba(0,0,0,.52)",
              }}
              aria-label="Prompt UI preview placeholder"
            >
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                  backgroundSize: "46px 46px",
                }}
              />
            </div>
            <div
              className="shot rounded-[var(--radius2)] border border-white/10 min-h-[200px] relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(700px 220px at 35% 0%, rgba(209,123,80,.16), transparent 65%), linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.18))",
                boxShadow: "0 22px 60px rgba(0,0,0,.52)",
              }}
              aria-label="Stems/timeline preview placeholder"
            >
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                  backgroundSize: "46px 46px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottomCta py-8 md:py-9 pb-10 md:pb-12" id="get-started">
        <div className="wrap max-w-cadenze mx-auto px-6">
          <div className="bottomRow flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 md:gap-6">
            <div>
              <h2 className="m-0 text-[28px] md:text-[34px] font-medium tracking-[-0.02em]">
                Built for momentum.
              </h2>
              <p className="mt-2.5 mb-0 text-[var(--muted)] text-sm leading-[1.7] max-w-[56ch]">
                Keep moving from idea to direction — without losing the thread.
              </p>
            </div>
            <Link
              href="/register"
              className="btn-primary shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 px-[18px] py-3 text-sm font-semibold bg-gradient-to-b from-[var(--orange1)] to-[var(--orange2)] shadow-[0_14px_40px_rgba(209,123,80,.2)] hover:opacity-95 hover:-translate-y-px transition-all"
            >
              Get started
            </Link>
          </div>

          <div className="footer text-center py-2.5 pb-6 text-[rgba(239,232,228,.52)] text-[13px]" id="pricing">
            Built for producers and songwriters 🌿
          </div>
        </div>
      </section>
    </main>
  );
}
