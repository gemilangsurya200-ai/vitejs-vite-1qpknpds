export type Lang = "id" | "en";

export interface LocalizedText {
  id: string;
  en: string;
}

export interface Question {
  id: string;
  dimension: LocalizedText;
  prompt: LocalizedText;
  weight: number; // 1 - 5
}

export interface AnswerItem {
  questionId: string;
  score: number; // 1 - 5
}

export interface AssessmentSubmission {
  id: string;
  createdAt: string;
  lang: Lang;
  answers: AnswerItem[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: LocalizedText;
  dimensionAverages: {
    dimensionId: string;
    dimension: LocalizedText;
    average: number;
  }[];
}

export interface DatabaseSchema {
  questions: Question[];
  submissions: AssessmentSubmission[];
}
