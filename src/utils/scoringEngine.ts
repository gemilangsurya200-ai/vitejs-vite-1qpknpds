import { QUESTION_MAP } from "../data/questions";
import type {
  AssessmentAnswer,
  DimensionKey,
  DimensionScores,
  PersonaType,
} from "../types";

/** Nilai maksimum skala ordinal opsi (0–3). */
const MAX_VALUE = 3;

/**
 * Konvensi skor dimensi (0–100):
 * - frequency, reliance      : intensitas (tinggi = penggunaan/ketergantungan besar)
 * - transparency, ethics, autonomy : kualitas (tinggi = lebih baik)
 */
const DIMENSION_SOURCES: Record<
  DimensionKey,
  { questionId: string; invert?: boolean }[]
> = {
  frequency: [{ questionId: "Q2" }],
  reliance: [{ questionId: "Q3" }, { questionId: "Q4" }],
  transparency: [{ questionId: "Q5" }],
  ethics: [{ questionId: "Q6" }],
  autonomy: [{ questionId: "Q7", invert: true }, { questionId: "Q8" }],
};

const DIMENSION_KEYS = Object.keys(DIMENSION_SOURCES) as DimensionKey[];

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

const normalize = (value: number, invert = false): number => {
  const v = clamp(value, 0, MAX_VALUE);
  return ((invert ? MAX_VALUE - v : v) / MAX_VALUE) * 100;
};

/** Rata-rata tertimbang (berdasar Question.weight) untuk satu dimensi. */
function scoreDimension(
  dimension: DimensionKey,
  answerMap: Map<string, number>
): number {
  let total = 0;
  let weightSum = 0;

  for (const { questionId, invert } of DIMENSION_SOURCES[dimension]) {
    const value = answerMap.get(questionId);
    const weight = QUESTION_MAP[questionId]?.weight ?? 0;
    if (value === undefined || weight <= 0) continue;
    total += normalize(value, invert) * weight;
    weightSum += weight;
  }

  return weightSum > 0 ? Math.round(total / weightSum) : 0;
}

export function calculateDimensionScores(
  answers: AssessmentAnswer[]
): DimensionScores {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedValue]));

  return DIMENSION_KEYS.reduce((acc, key) => {
    acc[key] = scoreDimension(key, answerMap);
    return acc;
  }, {} as DimensionScores);
}

const PERSONA_DESCRIPTIONS: Record<PersonaType, string> = {
  "Strategic Co-Pilot":
    "Anda memakai AI sebagai mitra berpikir: transparan, beretika, dan tetap mandiri dalam menalar. Pertahankan kebiasaan ini dan bagikan praktiknya kepada rekan.",
  "Ethical Pragmatist":
    "Anda memakai AI secara praktis dengan kesadaran etika yang cukup. Masih ada ruang untuk meningkatkan konsistensi sitasi dan kemandirian berpikir.",
  "Vulnerable Dependent":
    "Anda cenderung bergantung pada AI dan kurang percaya diri tanpanya. Latih kemampuan menalar dan menulis mandiri sebelum melibatkan AI.",
  "High-Risk Shortcutter":
    "Anda memakai AI secara intens sebagai jalan pintas dengan transparansi dan kesadaran etika rendah, sehingga berisiko pada integritas akademik. Perbaiki pengakuan penggunaan AI segera.",
};

export function determinePersona(scores: DimensionScores): {
  persona: PersonaType;
  description: string;
} {
  const { frequency, reliance, transparency, ethics, autonomy } = scores;
  const integrity = (transparency + ethics) / 2;

  let persona: PersonaType;

  if (integrity < 40 && (reliance >= 50 || frequency >= 50)) {
    persona = "High-Risk Shortcutter";
  } else if (reliance >= 50 && autonomy < 50) {
    persona = "Vulnerable Dependent";
  } else if (transparency >= 60 && ethics >= 60 && autonomy >= 60) {
    persona = "Strategic Co-Pilot";
  } else {
    persona = "Ethical Pragmatist";
  }

  return { persona, description: PERSONA_DESCRIPTIONS[persona] };
}

/**
 * Dimensi terlemah = risiko tertinggi.
 * Frequency & reliance dipakai apa adanya (tinggi = berisiko);
 * transparency, ethics, autonomy di-inversi (rendah = berisiko).
 */
export function identifyWeakestDimension(
  scores: DimensionScores
): keyof DimensionScores {
  const risk: DimensionScores = {
    frequency: scores.frequency,
    reliance: scores.reliance,
    transparency: 100 - scores.transparency,
    ethics: 100 - scores.ethics,
    autonomy: 100 - scores.autonomy,
  };

  return DIMENSION_KEYS.reduce((worst, key) =>
    risk[key] > risk[worst] ? key : worst
  );
}