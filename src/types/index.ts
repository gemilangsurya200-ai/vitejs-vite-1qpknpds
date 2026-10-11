/** Profil pengguna */
export interface UserProfile {
  id: string;
  email: string;
  academicYear: string; // contoh: "2024/2025" atau "Semester 3"
}

/** Dimensi penilaian */
export type DimensionKey =
  | "frequency"
  | "reliance"
  | "transparency"
  | "ethics"
  | "autonomy";

/** Opsi jawaban untuk sebuah pertanyaan */
export interface QuestionOption {
  id: string;
  questionText: string; // label opsi yang ditampilkan
  category: DimensionKey;
  weight: number; // bobot skor opsi
}

/** Pertanyaan asesmen */
export interface Question {
  id: string;
  questionText: string;
  category: DimensionKey;
  weight: number; // bobot pertanyaan terhadap skor dimensi
  options?: QuestionOption[];
}

/** Jawaban pengguna untuk satu pertanyaan */
export interface AssessmentAnswer {
  questionId: string;
  selectedValue: number;
}

/** Skor per dimensi (rentang dinormalisasi, mis. 0-100) */
export interface DimensionScores {
  frequency: number;
  reliance: number;
  transparency: number;
  ethics: number;
  autonomy: number;
}

/** Tipe persona hasil asesmen */
export type PersonaType =
  | "Strategic Co-Pilot"
  | "Ethical Pragmatist"
  | "Vulnerable Dependent"
  | "High-Risk Shortcutter";

/** Hasil akhir asesmen */
export interface AssessmentResult {
  id: string;
  timestamp: string; // ISO 8601
  dimensionScores: DimensionScores;
  persona: PersonaType;
  dominantWeakness: DimensionKey;
}