import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/utils";

type Option = {
  label: string;
  value: number;
};

type QuestionScreenProps = {
  questionIndex: number;
  totalQuestions: number;
  question: string;
  options: Option[];
  value?: number;
  onBack: () => void;
  onNext: (value: number) => void;
};

const QuestionScreen = ({
  questionIndex,
  totalQuestions,
  question,
  options,
  value,
  onBack,
  onNext,
}: QuestionScreenProps) => {
  const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  useEffect(() => {
    if (typeof value === "number") {
      setSelectedValue(value);
    } else {
      setSelectedValue(null);
    }
  }, [value, questionIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      const isDesktop = window.matchMedia("(min-width: 1280px)").matches;
      if (!isDesktop) return;

      if (selectedValue === null) return;

      e.preventDefault();
      handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedValue, questionIndex, options]);

  const handleNext = () => {
    if (selectedValue === null) return;

    const selected = options.find((o) => o.value === selectedValue);

    trackEvent("quickscan_next_clicked", {
      question_index: questionIndex + 1,
      answer_value: selectedValue,
      answer_label: selected?.label,
    });

    onNext(selectedValue);
  };

  const ProgressBlock = () => (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/50">
        <span>
          Vraag {questionIndex + 1} van {totalQuestions}
        </span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full bg-[#EB7F4B] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-20">
        <div className="w-full max-w-3xl">
          <div className="mb-4 hidden xl:block">
            <ProgressBlock />
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-4 py-5 shadow-[0_10px_50px_rgba(0,0,0,0.22)] backdrop-blur-md sm:px-6 sm:py-6 lg:px-7">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EB7F4B] sm:mb-4 sm:text-xs">
              Gymgroei Quickscan
            </p>

            <h1 className="text-[1.9rem] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[2.2rem] sm:leading-[1.02] lg:text-[2.75rem]">
              {question}
            </h1>

            <p className="mt-3 text-[1rem] leading-8 text-white/60 sm:mt-4 sm:text-[1.12rem] sm:leading-[1.5] lg:text-[1.2rem]">
              Hoe herkenbaar is deze situatie voor jouw gym?
            </p>

            <div className="mt-3 rounded-[1.25rem] border border-white/8 bg-white/[0.02] px-4 py-3 sm:mt-4 sm:px-5 sm:py-4">
              <p className="text-[0.95rem] leading-7 text-white/52 sm:text-base sm:leading-7">
                1 = totaal niet herkenbaar, 3 = deels herkenbaar, 5 = volledig
                herkenbaar.
              </p>
            </div>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {options.map((option) => {
                const isSelected = selectedValue === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedValue(option.value);

                      trackEvent("quickscan_answer_selected", {
                        question_index: questionIndex + 1,
                        answer_value: option.value,
                        answer_label: option.label,
                      });
                    }}
                    className={`flex min-h-[72px] w-full items-center justify-between rounded-[1.35rem] border px-4 py-3 text-left transition-all duration-200 sm:min-h-[78px] sm:px-5 sm:py-4 ${
                      isSelected
                        ? "border-[#EB7F4B]/45 bg-[#EB7F4B]/8 shadow-[0_0_0_1px_rgba(235,127,75,0.10)]"
                        : "border-white/8 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="pr-4 text-[1rem] font-medium leading-[1.28] text-white sm:text-[1.08rem]">
                      {option.label}
                    </span>

                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] border text-base font-semibold sm:h-12 sm:w-12 ${
                        isSelected
                          ? "border-[#EB7F4B]/45 text-[#EB7F4B]"
                          : "border-white/10 text-white/45"
                      }`}
                    >
                      {option.value}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedValue !== null && (
  <p className="mt-3 text-sm text-[#EB7F4B] xl:hidden">
    Antwoord geselecteerd. Ga door wanneer je klaar bent.
  </p>
)}

            <div className="mt-5 xl:hidden">
              <ProgressBlock />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6">
  <button
    type="button"
    onClick={onBack}
    disabled={questionIndex === 0}
    className={`inline-flex h-11 items-center justify-center rounded-[1rem] px-4 text-[0.95rem] font-medium transition sm:h-12 sm:px-6 sm:text-base ${
      questionIndex === 0
        ? "cursor-not-allowed border border-white/6 bg-white/[0.02] text-white/25"
        : "border border-white/8 bg-white/[0.03] text-white/55 hover:bg-white/[0.05] hover:text-white/80"
    }`}
  >
    Vorige
  </button>

  <div className="flex items-center gap-3">
    {selectedValue !== null && (
     <div className="hidden xl:flex items-center gap-2 text-xs text-white/40">
  <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md border border-white/10 bg-white/[0.03] px-2 text-[11px] font-medium text-white/55">
    Enter
  </span>
  <span>druk op Enter</span>
</div>
    )}

    <button
      type="button"
      disabled={selectedValue === null}
      onClick={handleNext}
      className={`inline-flex h-11 items-center justify-center rounded-[1rem] px-5 text-[0.95rem] font-medium transition sm:h-12 sm:px-6 sm:text-base ${
        selectedValue === null
          ? "cursor-not-allowed border border-white/6 bg-white/[0.02] text-white/25"
          : "border border-[#EB7F4B]/40 bg-[#EB7F4B] text-white shadow-[0_8px_25px_rgba(235,127,75,0.25)] hover:brightness-105"
      }`}
    >
      {questionIndex === totalQuestions - 1
        ? "Bekijk resultaat"
        : "Volgende vraag"}
    </button>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
