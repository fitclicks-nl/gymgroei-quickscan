import { useState } from "react";
import { trackEvent } from "@/lib/utils";

type StartScreenProps = {
  onStart: (name: string, mail: string) => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-xl text-center">

          {/* HEADLINE */}
          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Ontdek waar jouw gym
            <span className="block text-[#EB7F4B]">
              structureel groei laat liggen
            </span>
          </h1>

          {/* SUB */}
          <p className="mt-5 text-base leading-7 text-white/65 sm:text-lg">
            In 5 minuten zie je waar je op dit moment winst laat liggen
            en wat je als eerste moet aanpakken.
          </p>

          {/* VALUE BULLETS */}
          <div className="mt-6 space-y-2 text-sm text-white/60">
            <p>✓ Direct inzicht in je grootste aandachtspunt</p>
            <p>✓ Concrete stappen voor de komende 30 dagen</p>
            <p>✓ Eenmalig €49</p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 rounded-3xl border border-white/8 bg-white/[0.03] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-md"
          >
            <div className="space-y-4 text-left">

              {/* GYM NAME */}
              <div>
                <input
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="Naam van je gym"
                  className={`h-14 w-full rounded-2xl border bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/35 ${
                    gymNameError
                      ? "border-[#EB7F4B] ring-1 ring-[#EB7F4B]/40"
                      : "border-white/8 focus:border-[#EB7F4B]/60"
                  }`}
                />
              </div>

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mailadres"
                  className={`h-14 w-full rounded-2xl border bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/35 ${
                    emailError
                      ? "border-[#EB7F4B] ring-1 ring-[#EB7F4B]/40"
                      : "border-white/8 focus:border-[#EB7F4B]/60"
                  }`}
                />
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="group relative mt-2 inline-flex h-14 w-full items-center justify-center rounded-2xl px-6 text-base font-semibold text-white transition hover:scale-[1.02]"
              >
                <span
                  className="absolute -inset-1 rounded-[1.1rem]"
                  style={{
                    background: "rgba(235,127,75,0.35)",
                    filter: "blur(14px)",
                  }}
                />
                <span
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(18 80% 60%), hsl(24 85% 55%))",
                  }}
                />
                <span className="relative z-10">
                  Start jouw Quickscan
                </span>
              </button>
            </div>

            {/* FOOTNOTE */}
            <p className="mt-4 text-center text-sm text-white/45">
              Je ontvangt direct je analyse na het invullen.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
