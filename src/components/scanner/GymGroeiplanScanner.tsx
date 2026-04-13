import { useCallback, useState } from "react";
import StartScreen from "./StartScreen";
import QuestionScreen from "./QuestionScreen";
import LoadingScreen from "./LoadingScreen";
import ResultScreen from "./ResultScreen";

import {
  quickscanQuestions,
  likertOptions,
  generateQuickscanResult,
} from "@/lib/quickscan-logic";

type Phase = "start" | "questions" | "loading" | "result";

const GymGroeiplanScanner = () => {
  const [phase, setPhase] = useState<Phase>("start");
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleStart = (name: string, mail: string) => {
    setGymName(name);
    setEmail(mail);
    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setPhase("questions");
  };

  const handleNextAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    if (questionIndex < quickscanQuestions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    const generated = generateQuickscanResult(newAnswers);
    setResult(generated);
    setPhase("loading");
  };

  const handleBack = () => {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
  };

  const handleLoadingDone = useCallback(() => {
    setPhase("result");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,hsl(232_40%_10%),hsl(230_35%_8%))]">
      <div className="relative z-10">
        {phase === "start" && <StartScreen onStart={handleStart} />}

        {phase === "questions" && (
          <QuestionScreen
            questionIndex={questionIndex}
            totalQuestions={quickscanQuestions.length}
            question={quickscanQuestions[questionIndex].statement}
            options={likertOptions}
            value={answers[questionIndex]}
            onBack={handleBack}
            onNext={handleNextAnswer}
          />
        )}

        {phase === "loading" && (
          <LoadingScreen gymName={gymName} onDone={handleLoadingDone} />
        )}

        {phase === "result" && result && (
          <ResultScreen gymName={gymName} result={result} />
        )}
      </div>
    </div>
  );
};

export default GymGroeiplanScanner;