import { useEffect, useState } from "react";

type ResultScreenProps = {
  gymName: string;
  email: string;
  result: any;
};

const WORKER_BASE_URL = "https://quickscan-api.sweet-shadow-aa9c.workers.dev";
const PAYMENT_STORAGE_KEY = "quickscan_pending_payment";

const ResultScreen = ({ gymName, email, result }: ResultScreenProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPaymentReturn = params.get("payment") === "return";

    if (!isPaymentReturn) return;

    const storedPaymentId = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!storedPaymentId) {
      setPaymentError("Geen betaling gevonden om te controleren.");
      return;
    }

    const checkPayment = async () => {
      try {
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
          setShowSuccessMessage(true);
          localStorage.removeItem(PAYMENT_STORAGE_KEY);

          const cleanUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, "", cleanUrl);
        } else {
          setPaymentError("De betaling is nog niet afgerond.");
        }
      } catch {
        setPaymentError("Er ging iets mis bij het controleren van de betaling.");
      } finally {
        setIsCheckingPayment(false);
      }
    };

    checkPayment();
  }, []);

  useEffect(() => {
    if (!showSuccessMessage) return;

    const timer = window.setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4800);

    return () => window.clearTimeout(timer);
  }, [showSuccessMessage]);

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

  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } = result;

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
        `}
      </style>

      {showSuccessMessage && (
  <div className="pointer-events-none fixed inset-x-0 top-28 z-50 flex justify-center px-6 animate-fadeIn">
    <div className="flex items-center gap-3 rounded-2xl border border-[#EB7F4B]/30 bg-[rgba(235,127,75,0.12)] px-6 py-4 text-sm font-medium text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">

      {/* ICON */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EB7F4B] text-black text-xs font-bold">
        ✓
      </div>

      {/* TEXT */}
      <span>
        Betaling gelukt. Je Quickscan is nu volledig ontgrendeld.
      </span>
    </div>
  </div>
)}@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Jouw Quickscan resultaat
          </p>

          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-5xl">
            {gymName}, hier laat je nu het meeste resultaat liggen
          </h1>

          <div className="mt-4 space-y-3 text-base leading-7 text-white/65">
            <p>De meeste gyms denken dat ze meer leads nodig hebben.</p>
            <p>In de praktijk verliezen ze vooral resultaat in wat er al binnenkomt.</p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <p className="text-base leading-7 text-white/80">
              Als je dit niet oplost, blijf je afhankelijk van{" "}
              <span className="font-medium text-white">losse acties</span>, toeval en
              ruis in je marketing.
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

                <div className="relative mt-4 overflow-hidden">
                  <div
                    className="overflow-hidden"
                    style={{ maxHeight: "170px" }}
                  >
                    <p className="leading-7 text-white/75">{summary}</p>
                  </div>

                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(28,22,35,0.98)] via-[rgba(28,22,35,0.9)] to-transparent" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-[rgba(28,22,35,0.99)]" />
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
                <p className="text-sm font-medium text-[#EB7F4B]">
                  Ontgrendel jouw volledige Quickscan
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                  Zie precies wat je de komende 30 dagen moet doen
                </h3>

                <p className="mt-4 leading-7 text-white/68">
                  Je volledige Quickscan laat niet alleen zien waar het schuurt,
                  maar vooral wat je als eerste moet aanpakken.
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
                </div>

                <div className="mt-6 rounded-2xl border border-white/8 bg-black/10 px-4 py-5 text-center">
                  <p className="text-sm text-white/45">Eenmalig</p>
                  <p className="mt-1 text-3xl font-bold text-white">€49</p>

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
                        : "Ontgrendel nu →"}
                    </span>
                  </button>
                </div>

                {paymentError && (
                  <p className="mt-4 text-center text-sm text-red-300">
                    {paymentError}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
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

              <div className="mt-8 rounded-3xl border border-white/8 bg-white/[0.03] p-6">
                <h2 className="text-2xl font-semibold">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
