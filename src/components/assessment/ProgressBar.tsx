interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  stepTitle,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Step {currentStep} of {totalSteps}
          </p>
          {stepTitle && (
            <h2 className="mt-1 font-display text-lg font-bold text-slate-900 sm:text-xl">
              {stepTitle}
            </h2>
          )}
        </div>
        <span className="text-sm font-medium tabular-nums text-slate-500">
          {Math.round(percent)}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-label={`Langkah ${currentStep} dari ${totalSteps}`}
        className="h-2 w-full overflow-hidden rounded-full bg-primary-100"
      >
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}