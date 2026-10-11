import { Check } from "lucide-react";
import type { Question } from "../../types";

interface QuestionItemProps {
  question: Question;
  selectedValue: number | undefined;
  onSelectOption: (questionId: string, value: number) => void;
}

export default function QuestionItem({
  question,
  selectedValue,
  onSelectOption,
}: QuestionItemProps) {
  const options = question.options ?? [];
  const labelId = `${question.id}-label`;

  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-primary-100 px-1.5 text-xs font-bold text-primary-700">
          {question.id}
        </span>
        <h3
          id={labelId}
          className="text-base font-semibold leading-snug text-slate-900 sm:text-lg"
        >
          {question.questionText}
        </h3>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.weight;

          return (
            <label
              key={option.id}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500/40 ${
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/40"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.weight}
                checked={isSelected}
                onChange={() => onSelectOption(question.id, option.weight)}
                className="sr-only"
              />

              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-transparent bg-brand-gradient text-white"
                    : "border-slate-300 bg-white group-hover:border-primary-400"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>

              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-primary-900" : "text-slate-700"
                }`}
              >
                {option.questionText}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}