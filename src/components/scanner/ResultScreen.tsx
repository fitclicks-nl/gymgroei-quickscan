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

          <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <p className="text-base leading-7 text-white/80">
              Als je dit niet oplost, blijf je afhankelijk van{" "}
              <span className="font-medium text-white">losse acties</span>, toeval en
              ruis in je marketing.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
            <p className="text-sm font-medium text-[#EB7F4B]">
              Dit is waar je nu structureel winst laat liggen
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
              {priorityTitle}
            </h2>

            <p className="mt-4 leading-7 text-white/75">{summary}</p>

            <p className="mt-4 leading-7 text-white/65">
              Daardoor laat je nu waarschijnlijk structureel nieuwe leden liggen,
              zonder dat je dat elke dag direct doorhebt.
            </p>

            <p className="mt-4 leading-7 text-white/65">
              Dit is precies waarom groei nu minder voorspelbaar voelt dan nodig is.
            </p>
          </div>

          {!isUnlocked && (
            <div className="mt-8 rounded-3xl border border-[#EB7F4B]/20 bg-[linear-gradient(180deg,rgba(235,127,75,0.08),rgba(235,127,75,0.03))] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
              <p className="text-sm font-medium text-[#EB7F4B]">
                Ontgrendel jouw volledige Quickscan
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                Krijg direct inzicht in wat je de komende 30 dagen moet doen
              </h3>

              <p className="mt-4 leading-7 text-white/70">
                Je volledige Quickscan bevat alles wat je nodig hebt om van inzicht
                naar actie te gaan.
              </p>

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

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/45">Eenmalig</p>
                  <p className="text-3xl font-bold text-white">€49</p>
                </div>

                <button
                  type="button"
                  className="group relative inline-flex h-14 items-center justify-center overflow-visible rounded-2xl px-7 text-base font-semibold text-white transition duration-300 hover:scale-[1.02]"
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

              <p className="mt-4 text-sm text-white/40">
                Betaalkoppeling volgt hier in de volgende stap
              </p>
            </div>
          )}

          {isUnlocked && (
            <>
              <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                  Dit ga je de komende 30 dagen doen
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                  Niet alles tegelijk. Dit zijn de eerste stappen die het meeste verschil maken.
                </p>

                <div className="mt-6 space-y-5">
                  {actions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
                    >
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {action.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-white/70">
                        <span className="font-medium text-white">Dit ga je concreet doen:</span>{" "}
                        {action.what}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-white/60">
                        <span className="font-medium text-white">
                          Waarom dit belangrijk is:
                        </span>{" "}
                        {action.why}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-white/60">
                        <span className="font-medium text-white">
                          Wat dit oplevert:
                        </span>{" "}
                        {action.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
                <h3 className="text-lg font-semibold text-red-400">
                  Wat je nu beter niet kunt doen
                </h3>

                <p className="mt-3 leading-7 text-white/70">{avoid}</p>
              </div>

              <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
                <h3 className="text-xl font-semibold">Bekijk je scores per onderdeel</h3>

                <div className="mt-5 space-y-4">
                  {Object.entries(scores).map(([domain, score]) => {
                    const isLowest = domain === lowestDomain;

                    return (
                      <div key={domain}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span
                            className={
                              isLowest ? "font-medium text-[#EB7F4B]" : "text-white/80"
                            }
                          >
                            {domain}
                          </span>
                          <span
                            className={
                              isLowest ? "font-medium text-[#EB7F4B]" : "text-white/55"
                            }
                          >
                            {score}/5
                          </span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${
                              isLowest ? "bg-[#EB7F4B]" : "bg-white/35"
                            }`}
                            style={{ width: `${(Number(score) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-5 text-sm leading-6 text-white/55">
                  Je laagste score ligt bij{" "}
                  <span className="font-medium text-white">{lowestDomain}</span>. Daar
                  zit op dit moment je grootste aandachtspunt.
                </p>
              </div>

              <div className="mt-10 text-center">
                <p className="mb-4 text-sm text-white/50">
                  Wil je hierna samen de vertaalslag maken naar jouw gym?
                </p>

                <a
                  href="https://calendly.com/fitclicks/kickstart"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex h-14 items-center justify-center overflow-visible rounded-2xl px-7 text-base font-semibold text-white transition duration-300 hover:scale-[1.02]"
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
                    Plan een kennismaking →
                  </span>
                </a>

                <p className="mt-4 text-sm text-white/40">
                  Ontdek waar je nu concreet leden laat liggen
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsUnlocked(!isUnlocked)}
        className="fixed bottom-4 right-4 z-50 rounded-xl bg-white/5 px-4 py-2 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
      >
        Toggle unlock
      </button>
    </div>
  );
};

export default ResultScreen;