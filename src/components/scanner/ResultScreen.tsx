import { useEffect, useState } from "react";

type ResultScreenProps = {
  gymName: string;
  email: string;
  result: any;
  onRestart: () => void;
};

const WORKER_BASE_URL = "https://quickscan-api.sweet-shadow-aa9c.workers.dev";
const PAYMENT_STORAGE_KEY = "quickscan_pending_payment";

const ResultScreen = ({ gymName, email, result, onRestart }: ResultScreenProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "checking" | "success" | "failed"
  >("idle");

  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } = result;

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
              Je volledige Quickscan is klaar. Deze analyse is volledig gebaseerd op
              jouw antwoorden — geen standaard rapport.
            </p>

            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-[#EB7F4B] animate-[progressBar_2.0s_ease-out_forwards]" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
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
              In de praktijk gaat rendement vaak verloren in wat er al binnenkomt en
              hoe dat wordt opgevolgd.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <p className="text-base leading-7 text-white/80">
              Als je dit niet oplost, blijf je afhankelijk van{" "}
              <span className="font-medium text-white">losse acties</span>, toeval en
              ruis in je marketing.
            </p>
          </div>
      </div>
    </div>
  );
};

export default ResultScreen;
