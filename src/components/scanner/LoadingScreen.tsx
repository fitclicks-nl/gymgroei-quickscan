import { useEffect, useMemo, useState } from "react";

type LoadingScreenProps = {
  gymName: string;
  onDone: () => void;
};

const LoadingScreen = ({ gymName, onDone }: LoadingScreenProps) => {
  const steps = useMemo(
    () => [
      "We analyseren je antwoorden...",
      "We brengen in kaart waar je nu rendement laat liggen...",
      "We bepalen je grootste aandachtspunt...",
      "We vertalen dit naar concrete stappen voor jouw gym...",
      "Je persoonlijke Quickscan wordt opgebouwd...",
    ],
    []
  );

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= steps.length) {
      const doneTimer = window.setTimeout(() => {
        onDone();
      }, 500);

      return () => window.clearTimeout(doneTimer);
    }

    const delay = activeStep === steps.length - 2 ? 1400 : 850;

    const timer = window.setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeStep, steps.length, onDone]);

  const progress = Math.min((activeStep / steps.length) * 100, 100);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#EB7F4B] border-r-[#EB7F4B]/70 animate-spin"
                style={{ animationDuration: "1.15s" }}
              />
            </div>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
            Gymgroei Quickscan
          </p>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            We analyseren <span className="text-[#EB7F4B]">{gymName}</span>...
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
            We brengen in kaart waar je op dit moment de meeste winst laat liggen
            en wat je als eerste moet aanpakken.
          </p>

          <div className="mx-auto mt-10 rounded-3xl border border-white/8 bg-white/[0.03] p-5 text-left shadow-[0_10px_50px_rgba(0,0,0,0.22)] backdrop-blur-md sm:p-6">
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[#EB7F4B] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => {
                const isDone = index < activeStep;
                const isActive = index === activeStep;

                return (
                  <div key={step} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
                      {isDone ? (
                        <span className="text-lg font-semibold text-[#EB7F4B]">✓</span>
                      ) : isActive ? (
                        <span className="block h-4 w-4 rounded-full bg-white" />
                      ) : (
                        <span className="block h-4 w-4 rounded-full border border-white/25" />
                      )}
                    </div>

                    <p
                      className={`text-[1.05rem] leading-8 ${
                        isDone
                          ? "text-white/72"
                          : isActive
                          ? "text-white"
                          : "text-white/32"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-base leading-8 text-white/42">
            Dit is vaak precies het punt waar gyms ongemerkt resultaat laten liggen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
