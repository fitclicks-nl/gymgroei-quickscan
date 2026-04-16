import { useEffect, useState } from "react";
import { Shield, Clock3, CircleCheck } from "lucide-react";
import { trackEvent } from "@/lib/utils";

type StartScreenProps = {
  onStart: (name: string, mail: string) => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gymNameFromUrl = params.get("gymName");
    const emailFromUrl = params.get("email");

    if (gymNameFromUrl) {
      setGymName(gymNameFromUrl);
    }

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }

    if (!gymNameFromUrl && !emailFromUrl) {
      const raw = localStorage.getItem("fitclicks_scanner_prefill");
      if (!raw) return;

      try {
        const saved = JSON.parse(raw);

        if (saved?.gymName) {
          setGymName(saved.gymName);
        }

        if (saved?.email) {
          setEmail(saved.email);
        }
      } catch {
        // ignore broken storage
      }
    }
  }, []);

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!gymName.trim() || !isValidEmail(email)) return;

    trackEvent("quickscan_start", {
      gym_name: gymName,
    });

    onStart(gymName.trim(), email.trim());
  };

  const gymNameError = submitted && !gymName.trim();
  const emailError = submitted && !isValidEmail(email);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <style>
        {`
          @keyframes fitclicksGlowPulse {
            0% {
              transform: scale(0.98);
              opacity: 0.45;
              box-shadow: 0 0 0 rgba(235,127,75,0.00);
            }
            50% {
              transform: scale(1.03);
              opacity: 0.95;
              box-shadow: 0 0 40px rgba(235,127,75,0.45);
            }
            100% {
              transform: scale(0.98);
              opacity: 0.45;
              box-shadow: 0 0 0 rgba(235,127,75,0.00);
            }
          }
        `}
      </style>

      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 pb-16 pt-28 sm:pb-16 sm:pt-32">
        <div className="w-full max-w-2xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Gymgroei Quickscan
          </p>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            Krijg scherp waar jouw gym{" "}
            <span className="text-[#EB7F4B]">
              niet optimaal is ingericht voor groei
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            In 5 minuten zie je waar je op dit moment kansen laat liggen, wat je
            grootste aandachtspunt is en waar je als eerste moet beginnen.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 rounded-3xl border border-white/8 bg-white/[0.03] p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5"
          >
            <div className="space-y-4 text-left">
              <div>
                <input
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="Naam van je gym"
                  className={`h-14 w-full rounded-2xl border bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 ${
                    gymNameError
                      ? "border-[#EB7F4B] ring-1 ring-[#EB7F4B]/40"
                      : "border-white/8 focus:border-[#EB7F4B]/60 focus:ring-1 focus:ring-[#EB7F4B]/30"
                  }`}
                />
                {gymNameError && (
                  <p className="mt-2 text-sm text-[#EB7F4B]">
                    Vul de naam van je gym in.
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mailadres"
                  className={`h-14 w-full rounded-2xl border bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 ${
                    emailError
                      ? "border-[#EB7F4B] ring-1 ring-[#EB7F4B]/40"
                      : "border-white/8 focus:border-[#EB7F4B]/60 focus:ring-1 focus:ring-[#EB7F4B]/30"
                  }`}
                />
                {emailError && (
                  <p className="mt-2 text-sm text-[#EB7F4B]">
                    Vul een geldig e-mailadres in.
                  </p>
                )}
              </div>
              
              {(gymName || email) && (
  <p className="mt-2 text-xs text-white/40 text-center">
    We hebben je gegevens alvast ingevuld op basis van je vorige stap. Controleer ze even voordat je verdergaat.
  </p>
)}

              <button
                type="submit"
                className="group relative mt-2 inline-flex h-14 w-full items-center justify-center overflow-visible rounded-2xl px-6 text-base font-semibold text-white transition duration-300 hover:scale-[1.01]"
              >
                <span
                  className="absolute -inset-1 rounded-[1.1rem]"
                  style={{
                    background: "rgba(235,127,75,0.45)",
                    filter: "blur(18px)",
                    animation: "fitclicksGlowPulse 2.2s ease-in-out infinite",
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
                <span className="absolute inset-0 z-[2] rounded-2xl bg-white/10 opacity-0 transition group-hover:opacity-100" />
                <span className="relative z-10">Start jouw Quickscan</span>
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-white/50">
              Je ontvangt je analyse direct na de scan.
            </p>
            <p className="mt-2 text-center text-xs text-white/40">
              We gebruiken je gegevens alleen om je Quickscan te tonen en toe te
              sturen. Geen spam.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/8 pt-5 text-sm text-white/55">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-white/55" />
                <span>Betaald product</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 size={16} className="text-white/55" />
                <span>Binnen 5 minuten ingevuld</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleCheck size={16} className="text-white/55" />
                <span>Direct inzicht en prioriteit</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
