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
  onSelect: (value: number) => void;
};

const QuestionScreen = ({
  questionIndex,
  totalQuestions,
  question,
  options,
  onSelect,
}: QuestionScreenProps) => {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const handleSelect = (option: QuestionOption) => {
    trackEvent("quickscan_answer", {
      question_index: questionIndex + 1,
      answer_value: option.value,
      answer_label: option.label,
    });

    onSelect(option.value);
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
              Kies in hoeverre deze stelling op jouw gym van toepassing is.
            </p>

            <div className="mt-8 space-y-3">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="group w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-left transition duration-200 hover:border-[#EB7F4B]/45 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-medium text-white/90">
                      {option.label}
                    </span>

                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white/55 transition group-hover:border-[#EB7F4B]/30 group-hover:text-[#EB7F4B]">
                      {option.value}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-5 gap-2 text-center text-xs text-white/35 sm:text-sm">
              <div>Helemaal oneens</div>
              <div />
              <div>Neutraal</div>
              <div />
              <div>Helemaal eens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
