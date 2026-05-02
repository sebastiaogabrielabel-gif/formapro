interface Step {
  id: number;
  label: string;
}

interface Props {
  steps: Step[];
  current: number;
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-start flex-1">
          <div className="flex flex-col items-center min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-syne transition-colors flex-shrink-0
              ${
                current > step.id
                  ? "bg-violet text-white"
                  : current === step.id
                  ? "bg-violet text-white ring-4 ring-violet/20"
                  : "bg-border text-muted"
              }`}
            >
              {current > step.id ? "✓" : step.id}
            </div>
            <span
              className={`text-xs mt-1 font-dm hidden sm:block text-center leading-tight transition-colors whitespace-nowrap
              ${current >= step.id ? "text-ink" : "text-muted"}`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 mt-4 transition-colors ${
                current > step.id ? "bg-violet" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
