import ProgressBar from "./ProgressBar";

interface QuestionScreenProps {
  questionIndex: number;
  totalQuestions: number;
  question: string;
  options: string[];
  onSelect: (answer: string) => void;
}

const QuestionScreen = ({
  questionIndex,
  totalQuestions,
  question,
  options,
  onSelect,
}: QuestionScreenProps) => {
  const remaining = totalQuestions - questionIndex;
  const remainingText =
    remaining <= 1 ? "Bijna klaar" : `Nog ${remaining} vragen`;

  return (
    <div className="flex flex-col items-center min-h-screen px-6 pt-12">
      <ProgressBar
        currentStep={questionIndex + 1}
        totalSteps={totalQuestions}
        remainingText={remainingText}
      />

      <div className="w-full max-w-xl animate-fade-in-up" key={questionIndex}>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {question}
        </h2>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className="option-card w-full text-left text-base font-medium hover:translate-x-1 transition-transform"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionScreen;
