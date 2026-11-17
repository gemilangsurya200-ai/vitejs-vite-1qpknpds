import type { DimensionScores, PersonaType, StudentAssessmentRecord } from "../types";

const personas: {
  persona: PersonaType;
  scores: DimensionScores;
}[] = [
  {
    persona: "Strategic Co-Pilot",
    scores: { frequency: 35, reliance: 30, transparency: 85, ethics: 90, autonomy: 80 },
  },
  {
    persona: "Ethical Pragmatist",
    scores: { frequency: 50, reliance: 35, transparency: 50, ethics: 70, autonomy: 65 },
  },
  {
    persona: "Vulnerable Dependent",
    scores: { frequency: 70, reliance: 75, transparency: 80, ethics: 75, autonomy: 35 },
  },
  {
    persona: "High-Risk Shortcutter",
    scores: { frequency: 90, reliance: 85, transparency: 20, ethics: 25, autonomy: 40 },
  },
];

const firstNames = [
  "Alya", "Bima", "Citra", "Daffa", "Elisa", "Farhan",
  "Gita", "Hendra", "Intan", "Jovan", "Kayla", "Lukman",
];
const lastNames = [
  "Putri", "Pratama", "Lestari", "Saputra", "Rahma", "Wijaya",
  "Permata", "Nugraha", "Pertiwi", "Santoso", "Ananda", "Firmansyah",
];

export const ADMIN_SEED_RECORDS: StudentAssessmentRecord[] = firstNames.map(
  (firstName, index) => {
    const personaData = personas[Math.floor(index / 3)];
    const fullName = `${firstName} ${lastNames[index]}`;
    return {
      user: {
        id: `seed_student_${index + 1}`,
        email: `240${String(index + 1).padStart(3, "0")}@example.edu`,
        academicYear: "Semester 5–6",
        fullName,
      },
      result: {
        id: `seed_assessment_${index + 1}`,
        timestamp: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
        dimensionScores: {
          ...personaData.scores,
          frequency: Math.min(100, Math.max(0, personaData.scores.frequency + (index % 3 - 1) * 5)),
        },
        persona: personaData.persona,
        dominantWeakness: "reliance",
      },
    };
  }
);
