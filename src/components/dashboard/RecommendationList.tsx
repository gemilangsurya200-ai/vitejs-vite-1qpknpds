import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Lightbulb,
  Target,
} from "lucide-react";
import {
  DIMENSION_LABELS,
  getRecommendationPlan,
  type Recommendation,
} from "../../data/recommendations";
import type { DimensionScores } from "../../types";

interface RecommendationListProps {
  weakestDimension: keyof DimensionScores;
  scores: DimensionScores;
}

interface RecommendationCardProps {
  item: Recommendation;
  score: number;
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}

function RecommendationCard({
  item,
  score,
  checked,
  onToggle,
}: RecommendationCardProps) {
  const isPriority = item.level === "priority";
  const doneCount = item.actionItems.filter(
    (_, i) => checked[`${item.id}:${i}`]
  ).length;

  return (
    <article
      className={`rounded-xl2 border bg-white p-5 transition sm:p-6 ${
        isPriority
          ? "border-primary-500 shadow-card ring-2 ring-primary-500/20"
          : "border-slate-200"
      }`}
    >
      <header className="flex flex-wrap items-center gap-2">
        {isPriority && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Prioritas Perbaikan
          </span>
        )}
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {DIMENSION_LABELS[item.dimension]}
        </span>
        <span className="ml-auto text-xs font-medium tabular-nums text-slate-400">
          Skor {score}/100
        </span>
      </header>

      <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
        <Lightbulb
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            isPriority ? "text-primary-600" : "text-amber-500"
          }`}
          aria-hidden="true"
        />
        {item.summary}
      </p>

      <ul className="mt-4 space-y-2">
        {item.actionItems.map((text, i) => {
          const key = `${item.id}:${i}`;
          const isChecked = !!checked[key];

          return (
            <li key={key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => onToggle(key)}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm leading-relaxed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  isChecked
                    ? "bg-primary-50 text-slate-400 line-through"
                    : "bg-slate-50 text-slate-700 hover:bg-primary-50/60"
                }`}
              >
                {isChecked ? (
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-300"
                    aria-hidden="true"
                  />
                )}
                <span>{text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {doneCount}/{item.actionItems.length} aksi selesai
        </span>

        {item.resource && (
          <a
            href={item.resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            {item.resource.label}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </footer>
    </article>
  );
}

export default function RecommendationList({
  weakestDimension,
  scores,
}: RecommendationListProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const plan = getRecommendationPlan(weakestDimension);

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section aria-labelledby="reco-heading">
      <div className="mb-4">
        <h2
          id="reco-heading"
          className="font-display text-xl font-bold text-slate-900"
        >
          Rekomendasi Perbaikan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fokus utama Anda saat ini:{" "}
          <strong className="text-primary-700">
            {DIMENSION_LABELS[weakestDimension]}
          </strong>
          . Centang aksi yang sudah Anda lakukan.
        </p>
      </div>

      <div className="space-y-4">
        {plan.map((item) => (
          <RecommendationCard
            key={item.id}
            item={item}
            score={scores[item.dimension]}
            checked={checked}
            onToggle={toggle}
          />
        ))}
      </div>
    </section>
  );
}