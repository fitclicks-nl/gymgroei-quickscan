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

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "checking" | "success" | "failed"
  >("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPaymentReturn = params.get("payment") === "return";

    if (!isPaymentReturn) return;

    const storedPaymentId = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!storedPaymentId) {
      setPaymentStatus("failed");
      return;
    }

    const checkPayment = async () => {
      try {
        setPaymentStatus("checking");
        setIsCheckingPayment(true);

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

          // URL opschonen
          const cleanUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, "", cleanUrl);

          // daarna terug naar normale state
          setTimeout(() => {
            setPaymentStatus("idle");
          }, 2000);
        } else {
          setPaymentStatus("failed");
        }
      } catch {
        setPaymentStatus("failed");
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

      if (!data.checkoutUrl || !data.paymentId) {
        throw new Error("Betaling starten mislukt.");
      }

      localStorage.setItem(PAYMENT_STORAGE_KEY, data.paymentId);
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setPaymentError(err.message);
      setIsStartingPayment(false);
    }
  };

  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } = result;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <style>
        {`
        @keyframes subtlePulse {
          0% { transform: scale(0.98); opacity: 0.4; }
          50% { transform: scale(1.02); opacity: 0.7; }
          100% { transform: scale(0.98); opacity: 0.4; }
        }

        @keyframes progressBar {
          from { width: 0% }
          to { width: 100% }
        }
      `}
      </style>

      {/* 🔥 SUCCESS OVERLAY */}
      {paymentStatus === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,12,25,0.85)] backdrop-blur-xl">
          <div className="text-center max-w-md px-6">

            <div className="mb-6 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-[#EB7F4B] flex items-center justify-center text-black font-bold">
                ✓
              </div>
            </div>

            <h2 className="text-2xl font-semibold">Betaling gelukt</h2>

            <p className="mt-3 text-white/70 leading-6">
              Je Quickscan wordt nu voor je klaargezet.
              Hier zie je precies waar jouw grootste groeikans zit.
            </p>

            <div className="mt-6 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#EB7F4B] animate-[progressBar_1.8s_ease-out_forwards]" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-5xl px-6 pt-28 pb-16">
        <div className="w-full max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold">
            {gymName}, hier laat je nu resultaat liggen
          </h1>

          {/* ❌ FAILED STATE */}
          {paymentStatus === "failed" && (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="text-sm text-red-300">
                Betaling niet voltooid of geannuleerd.
              </p>
              <p className="text-xs text-red-300/70 mt-1">
                Je kunt het opnieuw proberen.
              </p>
            </div>
          )}

          {!isUnlocked ? (
            <>
              {/* PREVIEW */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold">{priorityTitle}</h2>
                <p className="mt-3 text-white/70 line-clamp-4">
                  {summary}
                </p>
              </div>

              {/* PAYWALL */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-6 text-center">

                <p className="text-sm text-white/45">Eenmalig</p>
                <p className="text-3xl font-bold mt-1">€49</p>

                <button
                  onClick={handleStartPayment}
                  className="group relative mt-4 h-14 px-6 rounded-2xl font-semibold"
                >
                  <span
                    className="absolute -inset-1 rounded-xl blur-md"
                    style={{
                      background: "rgba(235,127,75,0.3)",
                      animation: "subtlePulse 2.4s infinite",
                    }}
                  />
                  <span className="relative z-10">
                    Ontgrendel nu →
                  </span>
                </button>

                {/* 🔥 MICROCOPY */}
                <p className="mt-3 text-sm text-white/70">
                  Direct inzicht in je grootste groeipunt + wat je de komende 30 dagen moet doen.
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Eenmalig • Geen abonnement • Direct beschikbaar
                </p>

              </div>
            </>
          ) : (
            <>
              {/* RESULT */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold">{priorityTitle}</h2>
                <p className="mt-3 text-white/70">{summary}</p>
              </div>

              <div className="mt-6 space-y-4">
                {actions.map((a: any, i: number) => (
                  <div key={i} className="p-4 border border-white/10 rounded-xl">
                    <h3 className="font-semibold">{i + 1}. {a.title}</h3>
                    <p className="text-sm text-white/70 mt-2">{a.what}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                <p className="text-red-300 text-sm">{avoid}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
