import { useEffect, useState } from "react";

type ResultScreenProps = {
  gymName: string;
  email: string;
  result: any;
  onRestart: () => void;
};

const WORKER_BASE_URL = "https://quickscan-api.sweet-shadow-aa9c.workers.dev";
const PAYMENT_STORAGE_KEY = "quickscan_pending_payment";
const STORAGE_KEY = "quickscan_result_state";

const ResultScreen = ({
  gymName,
  email,
  result,
  onRestart,
}: ResultScreenProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "checking" | "success" | "failed"
  >("idle");

  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } =
    result;

  // Herstel unlock-status uit storage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);
      if (saved?.isUnlocked) {
        setIsUnlocked(true);
      }
    } catch {
      // ignore broken storage
    }
  }, []);

  // Check betaling bij return van Mollie
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPaymentReturn = params.get("payment") === "return";

    if (!isPaymentReturn) return;

    const storedPaymentId = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!storedPaymentId) {
      setPaymentStatus("failed");
      setPaymentError("Betaling niet voltooid of geannuleerd.");
      return;
    }

    const checkPayment = async () => {
      try {
        setPaymentStatus("checking");
        setIsCheckingPayment(true);
        setPaymentError("");

        const res = await fetch(
          `${WORKER_BASE_URL}/payment-status?paymentId=${encodeURIComponent(
            storedPaymentId
          )}`
        );

        const data = await res.json();

        if (data.paid) {
          setIsUnlocked(true);
          setPaymentStatus("success");
          localStorage.removeItem(PAYMENT_STORAGE_KEY);

          // unlock-status ook opslaan in scanner storage
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            try {
              const saved = JSON.parse(raw);
              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                  ...saved,
                  isUnlocked: true,
                })
              );
            } catch {
              // ignore broken storage
            }
          }

          const cleanUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, "", cleanUrl);

          window.setTimeout(() => {
            setPaymentStatus("idle");
          }, 2400);
        } else {
          setPaymentStatus("failed");
          setPaymentError("Betaling niet voltooid of geannuleerd.");
        }
      } catch {
        setPaymentStatus("failed");
        setPaymentError("Er ging iets mis bij het controleren van de betaling.");
      } finally {
        setIsCheckingPayment(false);
      }
    };

    checkPayment();
  }, []);

  const handleStartPayment = async () => {
    try {
      setIsStartingPayment(true);
      setPaymentError("");

      const res = await fetch(`${WORKER_BASE_URL}/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gymName: gymName?.trim(),
          email: email?.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl || !data.paymentId) {
        throw new Error(data?.error || "Betaling starten mislukt.");
      }

      localStorage.setItem(PAYMENT_STORAGE_KEY, data.paymentId);
      window.location.href = data.checkoutUrl;
    } catch (error: any) {
      setPaymentError(
        error?.message || "Er ging iets mis bij het starten van de betaling."
      );
      setIsStartingPayment(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <style>
        {`
          @keyframes fitclicksSubtlePulse {
            0% {
              transform: scale(0.985);
              opacity: 0.32;
              box-shadow: 0 0 0 rgba(235,127,75,0);
            }
            50% {
              transform: scale(1.015);
              opacity: 0.62;
              box-shadow: 0 0 24px rgba(235,127,75,0.22);
            }
            100% {
              transform: scale(0.985);
              opacity: 0.32;
              box-shadow: 0 0 0 rgba(235,127,75,0);
            }
          }

          @keyframes progressBar {
            from { width: 0% }
            to { width: 100% }
          }
        `}
      </style>

      {paymentStatus === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,12,25,0.78)] backdrop-blur-xl">
          <div className="max-w-md px-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EB7F4B] text-base font-bold text-black">
                ✓
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white">
              Jouw analyse wordt samengesteld…
            </h2>

            <p className="mt-3 leading-6 text-white/70">
              Je volledige Quickscan is klaar. Deze analyse is volledig gebaseerd
              op jouw antwoorden en geen standaard rapport.
            </p>

            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-[#EB7F4B] animate-[progressBar_2.0s_ease-out_forwards]" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 pb-16 pt-28 sm:pb-16 sm:pt-32">
        <div className="w-full max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Jouw Quickscan resultaat
          </p>

          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            {gymName}, hier loopt jouw gym nu structureel groei mis
          </h1>

          <div className="mt-4 space-y-3 text-base leading-7 text-white/65">
            <p>De meeste gyms denken dat ze vooral meer leads nodig hebben.</p>
            <p>
              In de praktijk gaat rendement vaak verloren in wat er al binnenkomt
              en hoe dat wordt opgevolgd.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <p className="text-base leading-7 text-white/80">
              Als je dit niet oplost, blijf je afhankelijk van{" "}
              <span className="font-medium text-white">losse acties</span>,
              toeval en ruis in je marketing.
            </p>
          </div>

          {!isUnlocked ? (
            <>
              <div className="mt-8 rounded-3xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
                <p className="text-sm font-medium text-[#EB7F4B]">
                  Preview van jouw grootste aandachtspunt
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                  {priorityTitle}
                </h2>

                <div className="mt-4 space-y-4">
                  <p className="leading-7 text-white/78">
                    Op basis van je antwoorden zien we dat hier je grootste
                    groeikans ligt.
                  </p>
                  <p className="leading-7 text-white/65">
                    Wat hier precies misgaat en hoe je dit oplost, zie je in je
                    volledige Quickscan.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
                <p className="text-sm font-medium text-[#EB7F4B]">
                  Ontvang jouw volledige Quickscan
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                  Geen extra inzichten, maar een concreet plan voor jouw gym
                </h3>

                <p className="mt-4 leading-7 text-white/68">
                  Je volledige Quickscan laat zien waar het echt misloopt, wat je
                  als eerste moet aanpassen en waar je nu waarschijnlijk tijd of
                  resultaat laat liggen.
                </p>

                <div className="mt-5 space-y-3 text-white/74">
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
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-[#EB7F4B]">•</span>
                    <span>Direct toepasbaar voor de komende 30 dagen</span>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-white/55">
                  Vergelijkbaar met wat je normaal in een strategiegesprek zou
                  krijgen, maar dan direct toepasbaar.
                </p>

                <div className="mt-6 rounded-2xl border border-white/8 bg-black/10 px-4 py-5 text-center">
                  <p className="text-sm text-white/45">Eenmalig</p>
                  <p className="mt-1 text-3xl font-bold text-white">€79</p>

                  <p className="mt-3 text-sm text-white/60">
                    Geen standaard rapport, maar een analyse gebaseerd op jouw
                    antwoorden.
                  </p>

                  <button
                    type="button"
                    onClick={handleStartPayment}
                    disabled={isStartingPayment || isCheckingPayment}
                    className={`group relative mt-4 inline-flex h-14 items-center justify-center overflow-visible rounded-2xl px-7 text-base font-semibold text-white transition duration-300 ${
                      isStartingPayment || isCheckingPayment
                        ? "cursor-not-allowed opacity-70"
                        : "hover:scale-[1.01]"
                    }`}
                  >
                    <span
                      className="absolute -inset-1 rounded-[1.1rem]"
                      style={{
                        background: "rgba(235,127,75,0.26)",
                        filter: "blur(14px)",
                        animation:
                          isStartingPayment || isCheckingPayment
                            ? "none"
                            : "fitclicksSubtlePulse 2.4s ease-in-out infinite",
                        zIndex: 0,
                      }}
                    />
                    <span
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
                        zIndex: 1,
                      }}
                    />
                    <span className="absolute inset-0 z-[2] rounded-2xl bg-white/8 opacity-0 transition group-hover:opacity-100" />
                    <span className="relative z-10">
                      {isStartingPayment
                        ? "Betaling starten..."
                        : isCheckingPayment
                        ? "Betaling controleren..."
                        : "Bekijk mijn volledige Quickscan →"}
                    </span>
                  </button>

                  <p className="mt-3 text-center text-xs text-white/40">
                    Eenmalig €79 • Geen abonnement • Direct toegang
                  </p>
                </div>

                {(paymentStatus === "failed" || paymentError) && (
                  <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-center">
                    <p className="text-sm text-red-300">
                      {paymentError || "Betaling niet voltooid of geannuleerd."}
                    </p>
                    <p className="mt-1 text-xs text-red-300/70">
                      Je kunt het opnieuw proberen via de knop hierboven.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-8 text-sm text-white/50">
                Deze analyse is gebaseerd op jouw antwoorden en geen standaard
                rapport.
              </p>

              <div className="mt-4 rounded-3xl border border-[#EB7F4B]/20 bg-[#EB7F4B]/5 p-6 shadow-[0_10px_50px_rgba(0,0,0,0.20)]">
                <p className="text-sm font-medium text-[#EB7F4B]">
                  Dit is waar je nu structureel winst laat liggen
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                  {priorityTitle}
                </h2>

                <p className="mt-4 leading-7 text-white/75">{summary}</p>

                <p className="mt-4 leading-7 text-white/65">
                  Daardoor laat je nu waarschijnlijk structureel nieuwe leden
                  liggen, zonder dat je dat elke dag direct doorhebt.
                </p>

                <p className="mt-4 leading-7 text-white/65">
                  Dit is precies waarom groei nu minder voorspelbaar voelt dan
                  nodig is.
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-semibold">
                  Dit ga je de komende 30 dagen doen
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                  Niet alles tegelijk. Dit zijn de eerste stappen die het meeste
                  verschil maken.
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
                        <strong>Dit ga je concreet doen:</strong> {action.what}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-white/60">
                        <strong>Waarom dit belangrijk is:</strong> {action.why}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-white/60">
                        <strong>Wat dit oplevert:</strong> {action.result}
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
                <h3 className="text-xl font-semibold">
                  Bekijk je scores per onderdeel
                </h3>

                <div className="mt-5 space-y-4">
                  {Object.entries(scores).map(([domain, score]) => {
                    const isLowest = domain === lowestDomain;

                    return (
                      <div key={domain}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span
                            className={
                              isLowest
                                ? "font-medium text-[#EB7F4B]"
                                : "text-white/80"
                            }
                          >
                            {domain}
                          </span>
                          <span
                            className={
                              isLowest
                                ? "font-medium text-[#EB7F4B]"
                                : "text-white/55"
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
                  <span className="font-medium text-white">
                    {lowestDomain}
                  </span>
                  . Daar zit op dit moment je grootste aandachtspunt.
                </p>
              </div>

              <div className="mt-12 rounded-3xl border border-white/8 bg-white/[0.03] p-6 text-center shadow-[0_10px_50px_rgba(0,0,0,0.25)]">
                <h3 className="text-2xl font-semibold">
                  Klaar om dit ook echt aan te pakken?
                </h3>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
                  Je weet nu dat{" "}
                  <span className="font-medium text-white">
                    {lowestDomain}
                  </span>{" "}
                  je grootste groeikans is. Maar inzicht alleen verandert
                  niets. De volgende stap is zorgen dat dit ook echt wordt
                  opgelost in je marketing en opvolging.
                </p>

                <button
                  onClick={() =>
                    window.open(
                      "https://calendly.com/fitclicks/kickstart",
                      "_blank"
                    )
                  }
                  className="group relative mt-6 inline-flex h-14 items-center justify-center overflow-visible rounded-2xl px-7 text-base font-semibold text-white transition duration-300 hover:scale-[1.01]"
                >
                  <span
                    className="absolute -inset-1 rounded-[1.1rem]"
                    style={{
                      background: "rgba(235,127,75,0.25)",
                      filter: "blur(14px)",
                      animation:
                        "fitclicksSubtlePulse 2.6s ease-in-out infinite",
                      zIndex: 0,
                    }}
                  />
                  <span
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
                      zIndex: 1,
                    }}
                  />
                  <span className="absolute inset-0 z-[2] rounded-2xl bg-white/8 opacity-0 transition group-hover:opacity-100" />
                  <span className="relative z-10">
                    Plan een groeisessie →
                  </span>
                </button>

                <p className="mt-3 text-xs text-white/40">
                  We kijken samen naar jouw situatie en hoe je dit structureel
                  oplost.
                </p>
              </div>
            </>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={onRestart}
              className="mt-4 text-sm text-white/40 underline underline-offset-4 transition hover:text-white/70"
            >
              Opnieuw starten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
