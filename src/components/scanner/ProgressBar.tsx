interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  remainingText: string;
}

const ProgressBar = ({ currentStep, totalSteps, remainingText }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Stap {currentStep} van {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">{remainingText}</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
