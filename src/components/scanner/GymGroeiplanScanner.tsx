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
      questionIndex?: number;
      phase?: Phase;
    }) => {
      const payload = {
        gymName: next?.gymName ?? gymName,
        email: next?.email ?? email,
        answers: next?.answers ?? answers,
        result: next?.result ?? result,
        questionIndex: next?.questionIndex ?? questionIndex,
        phase: next?.phase ?? phase,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    },
    [gymName, email, answers, result, questionIndex, phase]
  );

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);

      if (saved?.gymName) setGymName(saved.gymName);
      if (saved?.email) setEmail(saved.email);
      if (Array.isArray(saved?.answers)) setAnswers(saved.answers);
      if (typeof saved?.questionIndex === "number") {
        setQuestionIndex(saved.questionIndex);
      }
      if (saved?.result) setResult(saved.result);

      if (saved?.result) {
        setPhase("result");
        return;
      }

      if (
        saved?.gymName ||
        saved?.email ||
        (Array.isArray(saved?.answers) && saved.answers.length > 0)
      ) {
        setPhase("questions");
        return;
      }

      setPhase("start");
    } catch {
      // ignore broken storage
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
      questionIndex: 0,
      phase: "questions",
    });
  };

  const handleNextAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    if (questionIndex < quickscanQuestions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);

      persistState({
        answers: newAnswers,
        questionIndex: nextIndex,
        phase: "questions",
      });

      return;
    }

    const generated = generateQuickscanResult(newAnswers);

    setResult(generated);
    setPhase("loading");

    persistState({
      answers: newAnswers,
      result: generated,
      questionIndex,
      phase: "loading",
    });
  };

  const handleBack = () => {
    if (questionIndex === 0) return;

    const prevIndex = questionIndex - 1;
    setQuestionIndex(prevIndex);

    persistState({
      questionIndex: prevIndex,
      phase: "questions",
    });
  };

  const handleLoadingDone = useCallback(() => {
    setPhase("result");

    persistState({
      phase: "result",
    });
  }, [persistState]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,hsl(232_40%_10%),hsl(230_35%_8%))]">
      <div className="relative z-10">
        <div className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex max-w-7xl items-center px-8 pt-6 sm:px-12 sm:pt-8 md:px-16 md:pt-10">
            <a
              href="https://fitclicks.nl"
              className="font-semibold tracking-[-0.02em] text-xl sm:text-2xl md:text-2xl leading-none opacity-95"
            >
              <span className="text-white">fit</span>
              <span className="text-[#EB7F4B]">clicks</span>
            </a>
          </div>
        </div>

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
