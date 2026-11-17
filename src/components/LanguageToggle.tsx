import type { Language } from "../data/translations";

interface LanguageToggleProps {
  language: Language;
  onChange: (language: Language) => void;
}

export default function LanguageToggle({
  language,
  onChange,
}: LanguageToggleProps) {
  return (
    <div
      role="group"
      aria-label={language === "id" ? "Pilih bahasa" : "Choose language"}
      className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 text-xs font-bold"
    >
      {(["id", "en"] as const).map((option, index) => (
        <span key={option} className="inline-flex items-center">
          {index > 0 && <span className="px-1 text-slate-300">|</span>}
          <button
            type="button"
            aria-pressed={language === option}
            onClick={() => onChange(option)}
            className={`rounded-md px-2 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              language === option
                ? "bg-primary-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {option.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
