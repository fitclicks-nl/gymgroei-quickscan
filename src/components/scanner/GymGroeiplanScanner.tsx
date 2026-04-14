import { useCallback, useEffect, useState } from "react";
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

const STORAGE_KEY = "quickscan_result_state";

const GymGroeiplanScanner = () => {
  const [phase, setPhase] = useState<Phase>("start");
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const persistState = useCallback(
    (next?: {
      gymName?: string;
      email?: string;
      answers?: number[];
      result?: any;
    }) => {
      const payload = {
        gymName: next?.gymName ?? gymName,
        email: next?.email ?? email,
        answers: next?.answers ?? answers,
        result: next?.result ?? result,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    [gymName, email, answers, result]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPaymentReturn = params.get("payment") === "return";

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);

      if (saved?.gymName) setGymName(saved.gymName);
      if (saved?.email) setEmail(saved.email);
      if (Array.isArray(saved?.answers)) setAnswers(saved.answers);
      if (saved?.result) setResult(saved.result);

      if (isPaymentReturn && saved?.result) {
        setPhase("result");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleStart = (name: string, mail: string) => {
    setGymName(name);
    setEmail(mail);
    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setPhase("questions");

    persistState({
      gymName: name,
      email: mail,
      answers: [],
      result: null,
    });
  };

  const handleNextAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    if (questionIndex < quickscanQuestions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      persistState({ answers: newAnswers });
      return;
    }

    const generated = generateQuickscanResult(newAnswers);
    setResult(generated);
    setPhase("loading");

    persistState({
      answers: newAnswers,
      result: generated,
    });
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
          <ResultScreen
            gymName={gymName}
            email={email}
            result={result}
          />
        )}
      </div>
    </div>
  );
};

export default GymGroeiplanScanner;
