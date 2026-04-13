import { useState, useCallback } from "react";
import StartScreen from "./StartScreen";
import QuestionScreen from "./QuestionScreen";
import LoadingScreen from "./LoadingScreen";
import ResultScreen from "./ResultScreen";
import {
  generateGroeiplan,
  ScannerData,
  GroeiplanResult,
} from "@/lib/groeiplan-logic";
import { trackEvent } from "@/lib/utils";

const questions = [
  {
    question: "Wat voor type gym heb je?",
    options: [
      "Boutique / PT studio",
      "Traditionele sportschool",
      "Low budget",
      "Milon / eGym",
    ],
  },
  {
    question: "Hoeveel leden heb je momenteel?",
    options: ["< 150", "150–300", "300–600", "600+"],
  },
  {
    question: "Wat wil je op dit moment vooral bereiken?",
    options: [
      "Meer nieuwe leads",
      "Meer leden uit mijn huidige leads halen",
      "Betere kwaliteit leads",
      "Meer structuur en rust in mijn marketing",
    ],
  },
  {
    question: "Waar loop je momenteel het meest op vast?",
    options: [
      "Te weinig leads",
      "Slechte leads",
      "Lage conversie naar lid",
      "Geen structuur in marketing",
    ],
  },
  {
    question: "Hoe ziet je marketing er nu uit?",
    options: [
      "Ik doe alles zelf",
      "We draaien ads, maar zonder duidelijke structuur",
      "Ik werk met een bureau",
      "Vrijwel niets",
    ],
  },
  {
    question: "Heb je een vaste structuur van lead → intake → lid?",
    options: ["Ja, maar niet optimaal", "Nee", "Geen idee"],
  },
  {
    question: "Wat is je maandbudget voor marketing?",
    options: ["< €500", "€500–€1500", "€1500–€3000", "€3000+"],
  },
];

type Phase = "start" | "questions" | "loading" | "result";

const GymGroeiplanScanner = () => {
  const [phase, setPhase] = useState<Phase>("start");
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<GroeiplanResult | null>(null);

  const handleStart = async (name: string, mail: string) => {
    setGymName(name);
    setEmail(mail);
    setQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setPhase("questions");
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    const data: ScannerData = {
      gymName,
      email,
      gymType: newAnswers[0],
      memberCount: newAnswers[1],
      mainGoal: newAnswers[2],
      biggestChallenge: newAnswers[3],
      currentMarketing: newAnswers[4],
      hasStructure: newAnswers[5],
      marketingBudget: newAnswers[6],
    };

    trackEvent("scanner_answers", {
      gym_name: gymName,
      gym_type: data.gymType,
      member_count: data.memberCount,
      main_goal: data.mainGoal,
      biggest_challenge: data.biggestChallenge,
      marketing_type: data.currentMarketing,
      structure: data.hasStructure,
      budget: data.marketingBudget,
    });

    const generatedResult = generateGroeiplan(data);

    try {
      await fetch("https://formspree.io/f/xwvwywdl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          source: "groeiplan scanner",
          gymName: data.gymName,
          email: data.email,
          gymType: data.gymType,
          memberCount: data.memberCount,
          mainGoal: data.mainGoal,
          biggestChallenge: data.biggestChallenge,
          currentMarketing: data.currentMarketing,
          hasStructure: data.hasStructure,
          marketingBudget: data.marketingBudget,
          phase: generatedResult.phase,
          bottleneckTitle: generatedResult.bottleneckTitle,
          bottleneckDescription: generatedResult.bottleneckDescription,
          impactText: generatedResult.impactText,
          steps: generatedResult.steps
            .map(
              (step, index) =>
                `${index + 1}. ${step.title} — ${step.description}`
            )
            .join("\n"),
        }),
      });
    } catch (error) {
      console.log("Form error:", error);
    }

    setResult(generatedResult);
    setPhase("loading");
  };

  const handleLoadingDone = useCallback(() => {
    setPhase("result");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,hsl(232_40%_10%),hsl(230_35%_8%))]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.075),rgba(0,0,0,0))]" />

        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsla(232, 50%, 40%, 0.30), transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsla(21, 82%, 57%, 0.30), transparent 70%)",
          }}
        />
      </div>

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
            totalQuestions={questions.length}
            question={questions[questionIndex].question}
            options={questions[questionIndex].options}
            onSelect={handleAnswer}
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
