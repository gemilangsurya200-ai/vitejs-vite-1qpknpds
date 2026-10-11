import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import type { DimensionKey, DimensionScores } from "../../types";

interface RadarChartWidgetProps {
  scores: DimensionScores;
}

interface ChartDatum {
  key: DimensionKey;
  label: string;
  value: number;
}

const DIMENSION_LABELS: Record<DimensionKey, string> = {
  frequency: "Frekuensi Penggunaan",
  reliance: "Porsi Kontribusi AI",
  transparency: "Transparansi Sitasi",
  ethics: "Kesadaran Etika",
  autonomy: "Kemandirian Kognitif",
};

const ORDER: DimensionKey[] = [
  "frequency",
  "reliance",
  "transparency",
  "ethics",
  "autonomy",
];

const COLOR = "#6366f1";

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload as ChartDatum;

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-card">
      <p className="text-xs font-medium text-slate-500">{datum.label}</p>
      <p className="mt-0.5 text-sm font-bold text-primary-700">
        {datum.value}
        <span className="text-xs font-medium text-slate-400"> / 100</span>
      </p>
    </div>
  );
}

export default function RadarChartWidget({ scores }: RadarChartWidgetProps) {
  const data: ChartDatum[] = ORDER.map((key) => ({
    key,
    label: DIMENSION_LABELS[key],
    value: scores[key],
  }));

  return (
    <div className="rounded-xl2 border border-slate-100 bg-white p-5 shadow-card sm:p-6">
      <h3 className="font-display text-lg font-bold text-slate-900">
        Peta Dimensi Etika AI
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Skala 0–100 pada lima dimensi penggunaan Generative AI Anda.
      </p>

      <div className="mt-2 h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="68%" margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Skor"
              dataKey="value"
              stroke={COLOR}
              strokeWidth={2}
              fill={COLOR}
              fillOpacity={0.25}
              dot={{ r: 3, fill: COLOR, strokeWidth: 0 }}
              animationDuration={800}
            />
            <Tooltip content={<ChartTooltip />} cursor={false} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
        Frekuensi &amp; Porsi Kontribusi menunjukkan <strong>intensitas</strong>{" "}
        (makin tinggi = makin banyak memakai AI). Tiga dimensi lainnya
        menunjukkan <strong>kualitas</strong> (makin tinggi = makin baik).
      </p>
    </div>
  );
}