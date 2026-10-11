import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3 } from "lucide-react";
import { QUESTIONS, QUESTION_MAP } from "../../data/questions";
import type { AssessmentAnswer } from "../../types";
import ProgressBar from "./ProgressBar";
import QuestionItem from "./QuestionItem";

interface AssessmentWizardProps {
  onComplete: (answers: AssessmentAnswer[]) => void;
  onCancel?: () => void;
}

interface WizardStep {
  title: string;
  questionIds: string[];
}

const STEPS: WizardStep[] = [
  { title: "Profil & Frekuensi", questionIds: ["Q1", "Q2"] },
  { title: "Porsi Kontribusi & Bagian Tugas", questionIds: ["Q3", "Q4"] },
  { title: "Integritas & Transparansi", questionIds: ["Q5", "Q6"] },
  { title: "Kemandirian & Refleksi Kritis", questionIds: ["Q7", "Q8"] },
];

export default function AssessmentWizard({
  onComplete,
  onCancel,
}: AssessmentWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const stepQuestions = step.questionIds.map((id) => QUESTION_MAP[id]);
  const isStepComplete = step.questionIds.every((id) => answers[id] !== undefined);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      onCancel?.();
      return;
    }
    setStepIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (!isStepComplete) return;

    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }

    const result: AssessmentAnswer[] = QUESTIONS.filter(
      (q) => answers[q.id] !== undefined
    ).map((q) => ({ questionId: q.id, selectedValue: answers[q.id] }));

    onComplete(result);
  };

  const backDisabled = stepIndex === 0 && !onCancel;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl2 border border-slate-100 bg-white p-6 shadow-card sm:p-8">
          <ProgressBar
            currentStep={stepIndex + 1}
            totalSteps={STEPS.length}
            stepTitle={step.title}
          />

          <div className="mt-8 space-y-8">
            {stepQuestions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                selectedValue={answers[question.id]}
                onSelectOption={handleSelect}
              />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={backDisabled}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepComplete}
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {isLastStep ? (
                <>
                  Lihat Hasil Analisis
                  <BarChart3 className="h-4 w-4" />
                </>
              ) : (
                <>
                  Lanjut
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {!isStepComplete && (
          <p className="mt-4 text-center text-xs text-slate-500">
            Jawab semua pertanyaan pada tahap ini untuk melanjutkan.
          </p>
        )}
      </div>
    </div>
  );
}