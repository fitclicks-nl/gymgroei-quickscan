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
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#EB7F4
