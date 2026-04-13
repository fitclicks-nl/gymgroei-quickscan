import { useEffect, useState } from "react";

type LoadingScreenProps = {
  gymName?: string;
  onDone: () => void;
};

const loadingSteps = [
  "Gegevens analyseren...",
  "Groeifase bepalen...",
  "Belangrijkste aandachtspunt identificeren...",
  "Kansen in leadgeneratie en conversie scannen...",
  "Persoonlijk groeiplan samenstellen...",
];

const LoadingScreen = ({ gymName, onDone }: LoadingScreenProps) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepTimings = [700, 1500, 2400, 3300, 4300];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    stepTimings.forEach((time, index) => {
      const timeout = setTimeout(() => {
        setActiveStep(index);
      }, time);
      timeouts.push(timeout);
    });

    const doneTimeout = setTimeout(() => {
      onDone();
    }, 5000);

    timeouts.push(doneTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-10 h-12 w-12 animate-spin rounded-full border border-white/10 border-t-[#EB7F4B]/80 opacity-80" />

          <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            We analyseren{" "}
            <span className="text-[#EB7F4B]">
              {gymName || "jouw gym"}
            </span>
            ...
          </h2>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/60 sm:text-lg">
            We brengen in kaart waar de grootste groeikansen en aandachtspunten liggen.
          </p>

          <div className="mx-auto mt-10 rounded-3xl border border-white/8 bg-white/[0.03] p-6 text-left shadow-[0_10px_50px_rgba(0,0,0,0.35),0_0_20px_rgba(235,127,75,0.05)] backdrop-blur-md">
            <ul className="space-y-4 text-sm sm:text-base">
              {loadingSteps.map((step, index) => {
                const isDone = index < activeStep;
                const isActive = index === activeStep;

                return (
                  <li
                    key={step}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      isActive
                        ? "text-white scale-[1.02]"
                        : isDone
                        ? "text-white/70"
                        : "text-white/40"
                    }`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center ${
                        isDone
                          ? "text-[#EB7F4B]"
                          : isActive
                          ? "text-white"
                          : "text-white/30"
                      }`}
                    >
                      {isDone ? "✓" : isActive ? "●" : "○"}
                    </span>
                    <span>{step}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-6 text-sm text-white/40">
            Dit is vaak precies het punt waar gyms ongemerkt leden laten liggen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
