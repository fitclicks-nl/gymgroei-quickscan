import { useEffect } from "react";
import { ArrowUpRight, Target, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import type { GroeiplanResult } from "@/lib/groeiplan-logic";
import { trackEvent } from "@/lib/utils";

type ResultScreenProps = {
  gymName?: string;
  result: GroeiplanResult;
};

const ResultScreen = ({ gymName, result }: ResultScreenProps) => {
  const phase =
    (result as any).phase ||
    (result as any).groeifase ||
    "Groeifase";

  const attentionTitle =
    (result as any).bottleneckTitle ||
    (result as any).grootsteGroeirem ||
    (result as any).bottleneck ||
    "Hier laat je nu de meeste groei liggen";

  const attentionDescription =
    (result as any).bottleneckDescription ||
    (result as any).diagnosis ||
    (result as any).toelichting ||
    "Er gaat nu waarschijnlijk vooral rendement verloren in de stap tussen interesse en daadwerkelijke inschrijving.";

  const steps =
    (result as any).steps ||
    (result as any).groeiplan ||
    [];

  const impactText =
    (result as any).impactText ||
    (result as any).impact ||
    "";

  const showImpact =
    typeof impactText === "string" &&
    (
      impactText.includes("leden per maand") ||
      impactText.includes("groeikansen") ||
      impactText.includes("instroom") ||
      impactText.includes("advertentiebudget")
    );

  useEffect(() => {
    trackEvent("scanner_complete", {
      phase,
      gym_name: gymName,
    });
  }, [phase, gymName]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <style>
        {`
          @keyframes fitclicksGlowSoft {
            0% {
              transform: scale(0.98);
              opacity: 0.35;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.6;
            }
            100% {
              transform: scale(0.98);
              opacity: 0.35;
            }
          }
        `}
      </style>

      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            {gymName ? `Groeiplan voor ${gymName}` : "Jouw persoonlijke groeiplan"}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            Jouw groeiplan
          </h1>
        </div>

        <div className="mt-10 space-y-5">
          <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EB7F4B]/12 text-[#EB7F4B]">
                <ArrowUpRight size={20} />
              </div>

              <div>
                <p className="text-sm text-white/45">Jouw groeifase</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">
                  {phase}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
                  Je gym zit in de {String(phase).toLowerCase()}. De basis staat,
                  maar de grootste winst zit nu in slimmer sturen op wat al binnenkomt.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#EB7F4B]/35 bg-[linear-gradient(180deg,rgba(235,127,75,0.10),rgba(235,127,75,0.04))] p-6 shadow-[0_0_40px_rgba(235,127,75,0.10)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EB7F4B]/15 text-[#EB7F4B]">
                <Target size={20} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#EB7F4B]">
                  Waar je nu de meeste groei laat liggen
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">
                  {attentionTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
                  {attentionDescription}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EB7F4B]/12 text-[#EB7F4B]">
                <Zap size={20} />
              </div>

              <div className="w-full">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                  Jouw groeiplan
                </h2>

                <div className="mt-6 space-y-6">
                  {steps.map((step: any, index: number) => (
                    <div key={index} className="relative pl-8">
                      {index !== steps.length - 1 && (
                        <div className="absolute left-[7px] top-6 h-[calc(100%+16px)] w-px bg-[#EB7F4B]/35" />
                      )}

                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-[#EB7F4B]" />

                      <h3 className="text-xl font-semibold tracking-[-0.02em]">
                        Stap {index + 1}: {step.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-white/60">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">
              Wat dit oplevert
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="mt-0.5 text-[#EB7F4B]" size={18} />
                <span>Betere leads die daadwerkelijk passen bij jouw gym</span>
              </div>
              <div className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="mt-0.5 text-[#EB7F4B]" size={18} />
                <span>Meer leden uit hetzelfde marketingbudget</span>
              </div>
              <div className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="mt-0.5 text-[#EB7F4B]" size={18} />
                <span>Minder tijd kwijt aan losse acties zonder resultaat</span>
              </div>
            </div>

            {showImpact && (
              <div className="mt-6 rounded-2xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/8 px-4 py-4 text-sm text-white/75 sm:text-base">
                {impactText}
              </div>
            )}
          </section>
        </div>

        <div className="mt-10 text-center">
  <p className="mb-4 text-sm text-white/60">
    Herkenbaar? Dan is dit precies waar je nu winst laat liggen.
  </p>

  <a
    href="https://calendly.com/fitclicks/kickstart"
    target="_blank"
    rel="noreferrer"
    onClick={() =>
      trackEvent("scanner_cta_click", {
        phase,
        gym_name: gymName,
      })
    }
    className="group relative inline-flex h-14 items-center justify-center overflow-visible rounded-2xl px-7 text-base font-semibold text-white transition duration-300 hover:scale-[1.01]"
  >
    <span
      className="absolute -inset-1 rounded-[1.1rem]"
      style={{
        background: "rgba(235,127,75,0.35)",
        filter: "blur(14px)",
        animation: "fitclicksGlowSoft 2.8s ease-in-out infinite",
      }}
    />
    <span
      className="absolute inset-0 rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
      }}
    />
    <span className="relative z-10">Plan een groeisessie</span>
    <ArrowRight
      className="relative z-10 ml-2 transition-transform group-hover:translate-x-0.5"
      size={18}
    />
  </a>

  <p className="mt-4 text-sm text-white/45">
    Dan kijken we samen waar jouw gym nu concreet rendement laat liggen.
  </p>
</div>
      </div>
    </div>
  );
};

export default ResultScreen;
