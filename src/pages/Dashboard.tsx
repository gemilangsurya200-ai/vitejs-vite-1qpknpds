import { Gauge, GraduationCap, LogOut, RefreshCw } from "lucide-react";
import PersonaCard from "../components/dashboard/PersonaCard";
import RadarChartWidget from "../components/dashboard/RadarChartWidget";
import RecommendationList from "../components/dashboard/RecommendationList";
import { determinePersona } from "../utils/scoringEngine";
import type { AssessmentResult, UserProfile } from "../types";

interface DashboardProps {
  user: UserProfile;
  result: AssessmentResult;
  onNewAssessment: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  user,
  result,
  onNewAssessment,
  onLogout,
}: DashboardProps) {
  const { description } = determinePersona(result.dimensionScores);

  const assessedAt = new Date(result.timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <Gauge className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900">
              AI-ETHIC METER
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-[200px] truncate text-sm font-semibold text-slate-800">
                {user.email}
              </p>
              <p className="flex items-center justify-end gap-1 text-xs text-slate-500">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                {user.academicYear}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Judul & aksi */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Hasil Analisis Penggunaan AI
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Asesmen terakhir: {assessedAt}
            </p>
          </div>

          <button
            type="button"
            onClick={onNewAssessment}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Mulai Asesmen Baru
          </button>
        </div>

        {/* Grid 2 kolom */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <PersonaCard persona={result.persona} description={description} />
            <RadarChartWidget scores={result.dimensionScores} />
          </div>

          <RecommendationList
            weakestDimension={result.dominantWeakness}
            scores={result.dimensionScores}
          />
        </div>
      </main>
    </div>
  );
}