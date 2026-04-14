import { useState, useEffect } from "react";
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

  // sync met bestaande antwoorden (bij teruggaan)
  useEffect(() => {
    if (typeof value === "number") {
      setSelectedValue(value);
    } else {
      setSelectedValue(null);
    }
  }, [value]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-4 pb-6 pt-16 sm:px-6 sm:pt-20">
        <div className="w-full max-w-3xl">
          {/* Progress */}
          <div className="mb-3">
            <div className="mb-2 flex justify-between text-sm text-white/50">
              <span>
                Vraag {questionIndex + 1} van {totalQuestions}
              </span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 w-full rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[#EB7F4B] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-md sm:px-6 sm:py-6">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#EB7F4B]">
              Gymgroei Quickscan
            </p>

            <h1 className="text-[2.1rem] font-bold leading-[1.0] tracking-[-0.04em] sm:text-5xl">
              {question}
            </h1>

            <p className="mt-3 text-base text-white/60">
              Hoe herkenbaar is deze situatie voor jouw gym?
            </p>

            <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/50">
              1 = totaal niet herkenbaar, 3 = deels herkenbaar, 5 = volledig herkenbaar.
            </div>

            {/* Options */}
            <div className="mt-4 space-y-3">
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
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
                      isSelected
                        ? "border-[#EB7F4B]/40 bg-[#EB7F4B]/10"
                        : "border-white/8 bg-white/[0.02]"
                    }`}
                  >
                    <span>{option.label}</span>

                    <span
                      className={`h-10 w-10 flex items-center justify-center rounded-lg border ${
                        isSelected
                          ? "border-[#EB7F4B] text-[#EB7F4B]"
                          : "border-white/10 text-white/40"
                      }`}
                    >
                      {option.value}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-5 flex justify-between">
              <button
                onClick={onBack}
                disabled={questionIndex === 0}
                className="h-11 px-4 rounded-lg border border-white/8 text-white/50 disabled:opacity-30"
              >
                Vorige
              </button>

              <button
                disabled={selectedValue === null}
                onClick={() => {
                  if (selectedValue !== null) {
                    trackEvent("quickscan_next_clicked", {
                      question_index: questionIndex + 1,
                      answer_value: selectedValue,
                    });

                    onNext(selectedValue);
                  }
                }}
                className="h-11 px-5 rounded-lg bg-white/10 text-white disabled:opacity-30"
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
  );
};

export default QuestionScreen;