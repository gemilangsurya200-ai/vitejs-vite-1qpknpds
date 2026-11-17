import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Gauge, LogOut, ShieldAlert, Users } from "lucide-react";
import LanguageToggle from "../components/LanguageToggle";
import { ADMIN_SEED_RECORDS } from "../data/adminSeedData";
import {
  translations,
  type Language,
} from "../data/translations";
import type { PersonaType, StudentAssessmentRecord } from "../types";
import { getAllStudentAssessmentRecords } from "../utils/storage";

interface AdminDashboardViewProps {
  onLogout: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const PERSONA_ORDER: PersonaType[] = [
  "Strategic Co-Pilot",
  "Ethical Pragmatist",
  "Vulnerable Dependent",
  "High-Risk Shortcutter",
];
const PERSONA_COLORS: Record<PersonaType, string> = {
  "Strategic Co-Pilot": "#10b981",
  "Ethical Pragmatist": "#6366f1",
  "Vulnerable Dependent": "#f59e0b",
  "High-Risk Shortcutter": "#f43f5e",
};

function getPersonaLabel(persona: PersonaType, language: Language): string {
  const copy = translations[language];
  const labels: Record<PersonaType, string> = {
    "Strategic Co-Pilot": copy.strategic,
    "Ethical Pragmatist": copy.pragmatic,
    "Vulnerable Dependent": copy.dependent,
    "High-Risk Shortcutter": copy.highRisk,
  };
  return labels[persona];
}

function getStudentName(record: StudentAssessmentRecord): string {
  if (record.user.fullName?.trim()) return record.user.fullName.trim();
  return record.user.email.split("@")[0] || record.user.email;
}

function getStudentNumber(record: StudentAssessmentRecord): string {
  return record.user.email.split("@")[0] || record.user.id;
}

function escapeCsv(value: string | number): string {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export default function AdminDashboardView({
  onLogout,
  language,
  onLanguageChange,
}: AdminDashboardViewProps) {
  const copy = translations[language];
  const [personaFilter, setPersonaFilter] = useState<PersonaType | "all">("all");
  const [exportError, setExportError] = useState("");

  const records = useMemo(
    () => [...getAllStudentAssessmentRecords(), ...ADMIN_SEED_RECORDS],
    []
  );
  const filteredRecords = records.filter(
    ({ result }) => personaFilter === "all" || result.persona === personaFilter
  );
  const distribution = PERSONA_ORDER.map((persona) => ({
    persona,
    label: getPersonaLabel(persona, language),
    count: records.filter(({ result }) => result.persona === persona).length,
  }));
  const overallAverage = records.length
    ? records.reduce(
        (sum, { result }) =>
          sum +
          Object.values(result.dimensionScores).reduce(
            (dimensionSum, score) => dimensionSum + score,
            0
          ) /
            5,
        0
      ) / records.length
    : 0;
  const highRiskCount = records.filter(
    ({ result }) => result.persona === "High-Risk Shortcutter"
  ).length;

  const handleExport = () => {
    setExportError("");
    try {
      const csvRows = [
        [
          copy.studentName,
          copy.studentNumber,
          copy.dimensionFrequency,
          copy.dimensionReliance,
          copy.dimensionTransparency,
          copy.dimensionEthics,
          copy.dimensionAutonomy,
          copy.persona,
        ],
        ...filteredRecords.map(({ user, result }) => [
          getStudentName({ user, result }),
          getStudentNumber({ user, result }),
          result.dimensionScores.frequency,
          result.dimensionScores.reliance,
          result.dimensionScores.transparency,
          result.dimensionScores.ethics,
          result.dimensionScores.autonomy,
          getPersonaLabel(result.persona, language),
        ]),
      ];
      const csv = `\uFEFF${csvRows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "ai-ethic-meter-rekap-mahasiswa.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[admin-dashboard] gagal mengekspor CSV", error);
      setExportError(
        language === "id"
          ? "CSV gagal dibuat. Silakan coba lagi."
          : "Could not create the CSV. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <Gauge className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-slate-900 sm:tracking-[0.18em]">
              AI-ETHIC METER
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
              {copy.adminLabel}
            </span>
            <LanguageToggle language={language} onChange={onLanguageChange} />
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {copy.adminDashboardTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{copy.adminDashboardSubtitle}</p>
        </div>

        <section aria-label={language === "id" ? "Ringkasan KPI" : "KPI summary"} className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl2 border border-slate-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{copy.respondentCount}</p>
              <Users className="h-5 w-5 text-primary-600" aria-hidden="true" />
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold text-slate-900">
              {records.length}
            </p>
          </article>
          <article className="rounded-xl2 border border-slate-100 bg-white p-5 shadow-card">
            <p className="text-sm font-medium text-slate-500">{copy.averageScore}</p>
            <p className="mt-3 font-display text-3xl font-extrabold text-slate-900">
              {overallAverage.toFixed(1)}
              <span className="ml-1 text-base font-semibold text-slate-400">/ 100</span>
            </p>
          </article>
          <article className="rounded-xl2 border border-rose-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{copy.highRiskCount}</p>
              <ShieldAlert className="h-5 w-5 text-rose-600" aria-hidden="true" />
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold text-rose-700">
              {highRiskCount}
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-xl2 border border-slate-100 bg-white p-5 shadow-card sm:p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {copy.personaDistribution}
          </h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  interval={0}
                />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} ${copy.distributionTooltip}`,
                    copy.persona,
                  ]}
                />
                <Bar dataKey="count" name={copy.persona} radius={[5, 5, 0, 0]}>
                  {distribution.map(({ persona }) => (
                    <Cell key={persona} fill={PERSONA_COLORS[persona]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl2 border border-slate-100 bg-white shadow-card">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <h2 className="font-display text-lg font-bold text-slate-900">
              {copy.studentRecap}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="persona-filter" className="sr-only">
                {copy.persona}
              </label>
              <select
                id="persona-filter"
                value={personaFilter}
                onChange={(event) =>
                  setPersonaFilter(event.target.value as PersonaType | "all")
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="all">{copy.allPersonas}</option>
                {PERSONA_ORDER.map((persona) => (
                  <option key={persona} value={persona}>
                    {getPersonaLabel(persona, language)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {copy.exportCsv}
              </button>
            </div>
          </div>
          {exportError && (
            <p role="alert" className="px-5 pt-4 text-sm text-red-600">
              {exportError}
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3">{copy.studentName}</th>
                  <th scope="col" className="px-5 py-3">{copy.studentNumber}</th>
                  <th scope="col" className="px-5 py-3" colSpan={5}>{copy.dimensionScores}</th>
                  <th scope="col" className="px-5 py-3">{copy.persona}</th>
                </tr>
                <tr className="border-t border-slate-200">
                  <th colSpan={2} className="px-5 py-2" />
                  <th className="px-3 py-2">{copy.dimensionFrequency}</th>
                  <th className="px-3 py-2">{copy.dimensionReliance}</th>
                  <th className="px-3 py-2">{copy.dimensionTransparency}</th>
                  <th className="px-3 py-2">{copy.dimensionEthics}</th>
                  <th className="px-3 py-2">{copy.dimensionAutonomy}</th>
                  <th className="px-5 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(({ user, result }) => (
                  <tr key={user.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-900">
                      {getStudentName({ user, result })}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                      {getStudentNumber({ user, result })}
                    </td>
                    {Object.values(result.dimensionScores).map((score, index) => (
                      <td key={`${user.id}-score-${index}`} className="px-3 py-3 tabular-nums text-slate-600">
                        {score}
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: PERSONA_COLORS[result.persona] }}
                      >
                        {getPersonaLabel(result.persona, language)}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                      {copy.noStudents}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
