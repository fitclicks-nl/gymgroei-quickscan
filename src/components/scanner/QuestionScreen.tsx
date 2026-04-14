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

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-start justify-center px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-20">
        <div className="w-full max-w-3xl">
          <div className="mb-3 sm:mb-4">
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

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] px-4 py-4 shadow-[0_10px_50px_rgba(0,0,0,0.22)] backdrop-blur-md sm:px-7 sm:py-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EB7F4B] sm:mb-4 sm:text-xs">
              Gymgroei Quickscan
            </p>

            <h1 className="text-[2.15rem] font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl">
              {question}
            </h1>

            <p className="mt-3 text-[1rem] leading-8 text-white/58 sm:mt-4 sm:text-[1.35rem] sm:leading-[1.45]">
              Hoe herkenbaar is deze situatie voor jouw gym?
            </p>

            <div className="mt-3 rounded-[1.35rem] border border-white/8 bg-white/[0.02] px-4 py-3 sm:mt-4 sm:px-5 sm:py-4">
              <p className="text-[0.95rem] leading-7 text-white/52 sm:text-base sm:leading-7">
                1 = totaal niet herkenbaar, 3 = deels herkenbaar, 5 = volledig
                herkenbaar.
              </p>
            </div>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {options.map((option) => {
                const isSelected = value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      trackEvent("quickscan_answer_selected", {
                        question_index: questionIndex + 1,
                        answer_value: option.value,
                        answer_label: option.label,
                      });

                      const event = new CustomEvent("quickscan-select-answer", {
                        detail: option.value,
                      });
                      window.dispatchEvent(event);
                    }}
                    className={`flex min-h-[76px] w-full items-center justify-between rounded-[1.4rem] border px-4 py-3 text-left transition-all duration-200 sm:min-h-[84px] sm:px-5 sm:py-4 ${
                      isSelected
                        ? "border-[#EB7F4B]/45 bg-[#EB7F4B]/7 shadow-[0_0_0_1px_rgba(235,127,75,0.12)]"
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
                className={`inline-flex h-11 items-center justify-center rounded-[1rem] px-4 text-[0.95rem] font-medium transition sm:h-12 sm:px-6 sm:text-base ${
                  typeof value !== "number"
                    ? "cursor-not-allowed border border-white/6 bg-white/[0.02] text-white/25"
                    : "border border-white/8 bg-white/[0.05] text-white/65 hover:bg-white/[0.08] hover:text-white"
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
  );
};

export default QuestionScreen;