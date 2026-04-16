import { useEffect, useState } from "react";
import { Shield, Clock3, CircleCheck } from "lucide-react";
import { trackEvent } from "@/lib/utils";

type StartScreenProps = {
  onStart: (name: string, mail: string) => void;
};

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gymNameFromUrl = params.get("gymName");
    const emailFromUrl = params.get("email");

    if (gymNameFromUrl) {
      setGymName(gymNameFromUrl);
    }

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }

    // fallback als er geen URL-parameters zijn
    if (!gymNameFromUrl && !emailFromUrl) {
      const raw = localStorage.getItem("fitclicks_scanner_prefill");
      if (!raw) return;

      try {
        const saved = JSON.parse(raw);

        if (saved?.gymName) {
          setGymName(saved.gymName);
        }

        if (saved?.email) {
          setEmail(saved.email);
        }
      } catch {
        // ignore broken storage
      }
    }
  }, []);

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!gymName.trim() || !isValidEmail(email)) return;

    trackEvent("quickscan_start", {
      gym_name: gymName,
    });

    onStart(gymName.trim(), email.trim());
  };

  const gymNameError = submitted && !gymName.trim();
  const emailError = submitted && !isValidEmail(email);

  return (
    <div>
      <input
        type="text"
        name="organization"
        autoComplete="organization"
        value={gymName}
        onChange={(e) => setGymName(e.target.value)}
        placeholder="Naam van je gym"
      />

      <input
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mailadres"
      />
    </div>
  );
};

export default StartScreen;
