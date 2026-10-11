import type { DimensionKey, Question, QuestionOption } from "../types";

/**
 * Konvensi bobot opsi (weight): skala ordinal 0–3, sesuai arah mentah jawaban.
 * - frequency & reliance : makin tinggi = makin intens penggunaan/ketergantungan
 * - transparency & ethics: makin tinggi = makin baik
 * - Q7 (kecemasan)       : makin tinggi = makin cemas (di-inversi oleh scoring engine)
 * - Q8 (refleksi)        : makin tinggi = makin sadar/khawatir terhadap nalar kritis
 * Q1 hanya konteks profil (weight pertanyaan = 0, tidak masuk kalkulasi skor).
 */

const opt = (
  qid: string,
  category: DimensionKey,
  items: [label: string, weight: number][]
): QuestionOption[] =>
  items.map(([questionText, weight], i) => ({
    id: `${qid}_${String.fromCharCode(97 + i)}`,
    questionText,
    category,
    weight,
  }));

export const QUESTIONS: Question[] = [
  {
    id: "Q1",
    questionText: "Saat ini Anda berada pada tahap perkuliahan apa?",
    category: "frequency",
    weight: 0,
    options: opt("Q1", "frequency", [
      ["Semester 1–2", 0],
      ["Semester 3–4", 1],
      ["Semester 5–6", 2],
      ["Di atas semester 6", 3],
    ]),
  },
  {
    id: "Q2",
    questionText:
      "Seberapa sering Anda menggunakan Generative AI untuk tugas kuliah dalam seminggu?",
    category: "frequency",
    weight: 1,
    options: opt("Q2", "frequency", [
      ["Hampir tiap hari", 3],
      ["Sering", 2],
      ["Jarang", 1],
      ["Tidak pernah", 0],
    ]),
  },
  {
    id: "Q3",
    questionText:
      "Berapa persen kontribusi AI terhadap hasil akhir tugas Anda?",
    category: "reliance",
    weight: 1,
    options: opt("Q3", "reliance", [
      ["Kurang dari 20%", 0],
      ["20–50%", 1],
      ["50–80%", 2],
      ["Lebih dari 80%", 3],
    ]),
  },
  {
    id: "Q4",
    questionText: "Bagian tugas mana yang paling sering Anda bantu dengan AI?",
    category: "reliance",
    weight: 1,
    options: opt("Q4", "reliance", [
      ["Brainstorming ide", 0],
      ["Menyusun outline", 2],
      ["Penulisan isi", 3],
      ["Editing / penyuntingan", 1],
    ]),
  },
  {
    id: "Q5",
    questionText:
      "Seberapa sering Anda menyatakan atau menyitasi penggunaan AI dalam tugas Anda?",
    category: "transparency",
    weight: 1,
    options: opt("Q5", "transparency", [
      ["Selalu", 3],
      ["Sering", 2],
      ["Jarang", 1],
      ["Tidak pernah", 0],
    ]),
  },
  {
    id: "Q6",
    questionText:
      "Menyajikan hasil AI sebagai karya sendiri tanpa pengakuan adalah bentuk plagiarisme.",
    category: "ethics",
    weight: 1,
    options: opt("Q6", "ethics", [
      ["Sangat setuju", 3],
      ["Setuju", 2],
      ["Tidak setuju", 1],
      ["Sangat tidak setuju", 0],
    ]),
  },
  {
    id: "Q7",
    questionText:
      "Seberapa cemas Anda jika harus mengerjakan tugas tanpa bantuan AI?",
    category: "autonomy",
    weight: 1,
    options: opt("Q7", "autonomy", [
      ["Sangat cemas", 3],
      ["Cukup cemas", 2],
      ["Sedikit cemas", 1],
      ["Tidak cemas", 0],
    ]),
  },
  {
    id: "Q8",
    questionText:
      "Seberapa khawatir Anda bahwa penggunaan AI melemahkan nalar kritis Anda?",
    category: "autonomy",
    weight: 1,
    options: opt("Q8", "autonomy", [
      ["Sangat khawatir", 3],
      ["Cukup khawatir", 2],
      ["Kurang khawatir", 1],
      ["Tidak khawatir", 0],
    ]),
  },
];

export const QUESTION_MAP: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q])
);
