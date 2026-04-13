import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/utils";

type QuestionOption = {
  label: string;
  value: number;
};

type QuestionScreenProps = {
  questionIndex: number;
  totalQuestions: number;
  question: string;
  options: QuestionOption[];
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
  const [selectedValue, setSelectedValue] = useState<number | undefined>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value, questionIndex]);

  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const isFirstQuestion = questionIndex === 0;

  const handleNext = () => {
    if (typeof selectedValue !== "number") return;

    const selectedOption = options.find((option) => option.value === selectedValue);

    trackEvent("quickscan_answer", {
      question_index: questionIndex + 1,
      answer_value: selectedValue,
      answer_label: selectedOption?.label ?? "",
    });

    onNext(selectedValue);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 pt-28 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between text-sm text-white/45">
              <span>
                Vraag {questionIndex + 1} van {totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[#EB7F4B] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B]">
              Gymgroei Quickscan
            </p>

            <h2 className="text-2xl font-bold leading-[1.15] tracking-[-0.03em] sm:text-3xl md:text-4xl">
              {question}
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/55 sm:text-base">
              Hoe herkenbaar is deze situatie voor jouw gym?
            </p>

            <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm leading-6 text-white/55">
              1 = totaal niet herkenbaar, 3 = deels herkenbaar, 5 = volledig herkenbaar.
            </div>

            <div className="mt-8 space-y-3">
              {options.map((option) => {
                const isSelected = selectedValue === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedValue(option.value)}
                    className={`group w-full rounded-2xl border px-5 py-4 text-left transition duration-200 ${
                      isSelected
                        ? "border-[#EB7F4B]/60 bg-[#EB7F4B]/10"
                        : "border-white/8 bg-white/[0.03] hover:border-[#EB7F4B]/35 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`text-base font-medium ${
                          isSelected ? "text-white" : "text-white/90"
                        }`}
                      >
                        {option.label}
                      </span>

                      <span
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition ${
                          isSelected
                            ? "border-[#EB7F4B]/50 bg-[#EB7F4B]/20 text-[#EB7F4B]"
                            : "border-white/10 bg-white/[0.04] text-white/55 group-hover:border-[#EB7F4B]/25 group-hover:text-[#EB7F4B]"
                        }`}
                      >
                        {option.value}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onBack}
                disabled={isFirstQuestion}
                className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium transition ${
                  isFirstQuestion
                    ? "cursor-not-allowed border border-white/8 bg-white/[0.03] text-white/25"
                    : "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                Vorige vraag
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={typeof selectedValue !== "number"}
                className={`inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold transition ${
                  typeof selectedValue === "number"
                    ? "bg-[#EB7F4B] text-white hover:scale-[1.01]"
                    : "cursor-not-allowed bg-white/10 text-white/30"
                }`}
              >
                {questionIndex === totalQuestions - 1 ? "Bekijk resultaat" : "Volgende vraag"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;