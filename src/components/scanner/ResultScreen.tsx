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

  const { scores, lowestDomain, summary, priorityTitle, actions, avoid } = result;

  // 🔥 DYNAMISCHE CTA CONTENT
  const ctaMap: Record<
    string,
    { title: string; description: string; button: string }
  > = {
    Instroom: {
      title: "Klaar om Instroom echt structureel op te lossen?",
      description:
        "Je weet nu dat Instroom je grootste groeikans is. De volgende stap is zorgen dat dit ook daadwerkelijk wordt opgelost in je marketing en opvolging.",
      button: "Plan een kennismaking over instroom →",
    },
    Conversie: {
      title: "Klaar om Conversie echt structureel op te lossen?",
      description:
        "Je weet nu dat Conversie je grootste groeikans is. De volgende stap is zorgen dat dit ook daadwerkelijk wordt opgelost in je marketing en opvolging.",
      button: "Plan een kennismaking over conversie →",
    },
    Positionering: {
      title: "Klaar om Positionering echt structureel op te lossen?",
      description:
        "Je weet nu dat Positionering je grootste groeikans is. De volgende stap is zorgen dat dit ook daadwerkelijk wordt opgelost in je marketing en opvolging.",
      button: "Plan een kennismaking over positionering →",
    },
    Sturing: {
      title: "Klaar om Sturing echt structureel op te lossen?",
      description:
        "Je weet nu dat Sturing je grootste groeikans is. De volgende stap is zorgen dat dit ook daadwerkelijk wordt opgelost in je marketing en opvolging.",
      button: "Plan een kennismaking over sturing →",
    },
  };

  const ctaContent =
    ctaMap[lowestDomain] || {
      title: `Klaar om ${lowestDomain} echt structureel op te lossen?`,
      description: `Je weet nu dat ${lowestDomain} je grootste groeikans is. De volgende stap is zorgen dat dit ook daadwerkelijk wordt opgelost in je marketing en opvolging.`,
      button: "Plan een kennismaking →",
    };

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

          window.history.replaceState({}, "", window.location.pathname);

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

      localStorage.setItem(PAYMENT_STORAGE_KEY, data.paymentId);
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setPaymentError(err.message);
      setIsStartingPayment(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* 🔥 SUCCESS SCREEN */}
      {paymentStatus === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="text-center max-w-md px-6">
            <div className="mb-6 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-[#EB7F4B] flex items-center justify-center text-black font-bold">
                ✓
              </div>
            </div>
            <h2 className="text-2xl font-semibold">Betaling gelukt</h2>
            <p className="mt-3 text-white/70">
              Je Quickscan wordt nu voor je klaargezet.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-5xl px-6 pt-28 pb-16">
        <div className="w-full max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold">
            {gymName}, hier laat je nu het meeste resultaat liggen
          </h1>

          {!isUnlocked ? (
            <>
              <div className="mt-6">
                <h2 className="text-xl font-semibold">{priorityTitle}</h2>
                <p className="mt-3 text-white/70 line-clamp-4">{summary}</p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-6 text-center">

                <p className="text-sm text-white/45">Eenmalig</p>
                <p className="text-3xl font-bold mt-1">€49</p>

                <button
                  onClick={handleStartPayment}
                  className="group relative mt-4 h-14 px-6 rounded-2xl font-semibold"
                >
                  <span className="relative z-10">
                    Ontgrendel nu →
                  </span>
                </button>

                <p className="mt-3 text-sm text-white/70">
                  Direct inzicht in je grootste groeipunt + wat je de komende 30 dagen moet doen.
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Eenmalig • Geen abonnement • Direct beschikbaar
                </p>

                {paymentStatus === "failed" && (
                  <p className="mt-4 text-red-300 text-sm">
                    Betaling niet voltooid of geannuleerd. Je kunt het opnieuw proberen via de knop hierboven.
                  </p>
                )}

              </div>
            </>
          ) : (
            <>
              <div className="mt-6">
                <h2 className="text-xl font-semibold">{priorityTitle}</h2>
                <p className="mt-3 text-white/70">{summary}</p>
              </div>

              {/* 🔥 CTA ONDERAAN */}
              <div className="mt-12 rounded-3xl border border-white/8 bg-white/[0.03] p-6 text-center">
                
                <h3 className="text-2xl font-semibold">
                  {ctaContent.title}
                </h3>

                <p className="mt-3 text-sm text-white/65">
                  {ctaContent.description}
                </p>

                <button
                  onClick={() => window.open("https://calendly.com/fitclicks/kickstart", "_blank")}
                  className="mt-6 rounded-2xl bg-[#EB7F4B] px-6 py-3 font-semibold text-black"
                >
                  {ctaContent.button}
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
