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
