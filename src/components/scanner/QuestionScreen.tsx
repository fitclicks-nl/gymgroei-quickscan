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

  const handleSelect = (selectedValue: number, selectedLabel: string) => {
    trackEvent("quickscan_answer_selected", {
      question_index: questionIndex + 1,
      answer_value: selectedValue,
      answer_label: selectedLabel,
    });
    onNext(selectedValue);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24">
        <div className="w-full max-w-3xl">
          {/* Progress */}
          <div className="mb-4 sm:mb-5">
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

          {/* Card */}
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-5 py-5 shadow-[0_10px_50px_rgba(0,0,0,0.22)] backdrop-blur-md sm:px-8 sm:py-7">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#EB7F4B] sm:mb-5">
              Gymgroei Quickscan
            </p>

            <h1 className="text-[2rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
              {question}
            </h1>

            <p className="mt-4 text-lg leading-8 text-white/60 sm:mt-5 sm:text-[1.75rem] sm:leading-[1.45]">
              Hoe herkenbaar is deze situatie voor jouw gym?
            </p>

            <div className="mt-4 rounded-[1.5rem] border border-white/8 bg-white/[0.02] px-4 py-3 sm:mt-5 sm:px-5 sm:py-4">
              <p className="text-base leading-8 text-white/52 sm:text-lg">
                1 = totaal niet herkenbaar, 3 = deels herkenbaar, 5 = volledig
                herkenbaar.
              </p>
            </div>

            {/* Answers */}
            <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
              {options.map((option) => {
                const isSelected = value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value, option.label)}
                    className={`flex w-full items-center justify-between rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-200 sm:px-5 sm:py-5 ${
                      isSelected
                        ? "border-[#EB7F4B]/45 bg-[#EB7F4B]/7 shadow-[0_0_0_1px_rgba(235,127,75,0.12)]"
                        : "border-white/8 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="pr-4 text-[1.1rem] font-medium leading-[1.35] text-white sm:text-[1.15rem]">
                      {option.label}
                    </span>

                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border text-lg font-semibold sm:h-12 sm:w-12 ${
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

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between sm:mt-7">
              <button
                type="button"
                onClick={onBack}
                disabled={questionIndex === 0}
                className={`inline-flex h-12 items-center justify-center rounded-[1rem] px-5 text-base font-medium transition sm:h-13 sm:px-6 ${
                  questionIndex === 0
                    ? "cursor-not-allowed border border-white/6 bg-white/[0.02] text-white/25"
                    : "border border-white/8 bg-white/[0.03] text-white/55 hover:bg-white/[0.05] hover:text-white/80"
                }`}
              >
                Vorige vraag
              </button>

              <button
                type="button"
                disabled={typeof value !== "number"}
                onClick={() => {
                  if (typeof value === "number") {
                    const selected = options.find((o) => o.value === value);
                    trackEvent("quickscan_next_clicked", {
                      question_index: questionIndex + 1,
                      answer_value: value,
                      answer_label: selected?.label,
                    });
                    onNext(value);
                  }
                }}
                className={`inline-flex h-12 items-center justify-center rounded-[1rem] px-5 text-base font-medium transition sm:h-13 sm:px-6 ${
                  typeof value !== "number"
                    ? "cursor-not-allowed border border-white/6 bg-white/[0.02] text-white/25"
                    : "border border-white/8 bg-white/[0.05] text-white/65 hover:bg-white/[0.08] hover:text-white"
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