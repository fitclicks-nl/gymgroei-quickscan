import { useEffect, useState } from "react";

type ResultScreenProps = {
  gymName: string;
  result: any;
};

const ResultScreen = ({ gymName, result }: ResultScreenProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("unlock") === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } = result;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Jouw Quickscan resultaat
          </p>

          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            {gymName}, hier laat je nu het meeste resultaat liggen
          </h1>

          <div className="mt-4 max-w-2xl space-y-3 text-base leading-7 text-white/65">
            <p>De meeste gyms denken dat ze meer leads nodig hebben.</p>
            <p>In de praktijk verliezen ze vooral resultaat in wat er al binnenkomt.</p>
          </div>

          {/* Pain block */}
          <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <p className="text-base leading-7 text-white/80">
              Als je dit niet oplost, blijf je afhankelijk van{" "}
              <span className="font-medium text-white">losse acties</span>, toeval en
              ruis in je marketing.
            </p>
          </div>

          {/* AANDACHTSPUNT MET FADE */}
          <div className="relative mt-8 rounded-3xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)] overflow-hidden">
            <p className="text-sm font-medium text-[#EB7F4B]">
              Dit is waar je nu structureel winst laat liggen
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
              {priorityTitle}
            </h2>

            <div className="relative mt-4">
              <div className="max-h-[220px] overflow-hidden">
                <p className="leading-7 text-white/75">{summary}</p>

                <p className="mt-4 leading-7 text-white/65">
                  Daardoor laat je nu waarschijnlijk structureel nieuwe leden liggen,
                  zonder dat je dat elke dag direct doorhebt.
                </p>

                <p className="mt-4 leading-7 text-white/65">
                  Dit is precies waarom groei nu minder voorspelbaar voelt dan nodig is.
                </p>
              </div>

              {/* BETERE FADE */}
              {!isUnlocked && (
                <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/80 to-transparent" />
              )}
            </div>
          </div>

          {/* PAYWALL */}
          {!isUnlocked && (
            <div className="mt-[-30px] pt-8 border-t border-white/5 rounded-3xl border border-[#EB7F4B]/20 bg-[linear-gradient(180deg,rgba(235,127,75,0.08),rgba(235,127,75,0.03))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <p className="text-sm font-medium text-[#EB7F4B]">
                Ontgrendel jouw volledige Quickscan
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                Zie precies wat je de komende 30 dagen moet doen
              </h3>

              <div className="mt-5 space-y-3 text-white/75">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-[#EB7F4B]">•</span>
                  <span>Je 3 belangrijkste acties in de juiste volgorde</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-[#EB7F4B]">•</span>
                  <span>Wat je nu beter niet kunt doen</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-[#EB7F4B]">•</span>
                  <span>Je complete overzicht per domein</span>
                </div>
              </div>

              {/* PRIJS + CTA */}
              <div className="mt-6 text-center">
                <p className="text-sm text-white/45">Eenmalig</p>
                <p className="text-3xl font-bold text-white">€49</p>

                <button
                  type="button"
                  className="group relative mt-4 inline-flex h-14 items-center justify-center overflow-visible rounded-2xl px-7 text-base font-semibold text-white transition duration-300 hover:scale-[1.02]"
                >
                  <span
                    className="absolute -inset-1 rounded-[1.2rem]"
                    style={{
                      background: "rgba(235,127,75,0.35)",
                      filter: "blur(18px)",
                      opacity: 0.7,
                    }}
                  />
                  <span
                    className="relative inline-flex h-full w-full items-center justify-center rounded-2xl px-7"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
                    }}
                  >
                    Ontgrendel nu →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* UNLOCKED CONTENT */}
          {isUnlocked && (
            <>
              <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-semibold">
                  Dit ga je de komende 30 dagen doen
                </h2>

                <div className="mt-6 space-y-5">
                  {actions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
                    >
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {action.title}
                      </h3>

                      <p className="mt-3 text-sm text-white/70">
                        <strong>Dit ga je concreet doen:</strong> {action.what}
                      </p>

                      <p className="mt-3 text-sm text-white/60">
                        <strong>Waarom dit belangrijk is:</strong> {action.why}
                      </p>

                      <p className="mt-3 text-sm text-white/60">
                        <strong>Wat dit oplevert:</strong> {action.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DEBUG BUTTON */}
      <button
        onClick={() => setIsUnlocked(!isUnlocked)}
        className="fixed bottom-4 right-4 z-50 rounded-xl bg-white/5 px-4 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
      >
        Toggle unlock
      </button>
    </div>
  );
};

export default ResultScreen;