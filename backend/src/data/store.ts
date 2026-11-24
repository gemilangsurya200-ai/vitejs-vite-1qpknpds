import fs from "fs";
import path from "path";
import { DatabaseSchema, Question } from "../types";

const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q1",
    dimension: {
      id: "Transparansi & Kejujuran Akademik",
      en: "Transparency & Academic Integrity",
    },
    prompt: {
      id: "Saya menyatakan secara jujur kapan dan bagaimana Generative AI digunakan dalam tugas atau karya saya.",
      en: "I transparently disclose when and how Generative AI is used in my assignments or work.",
    },
    weight: 1,
  },
  {
    id: "q2",
    dimension: {
      id: "Verifikasi Kritis & Akurasi",
      en: "Critical Verification & Accuracy",
    },
    prompt: {
      id: "Saya selalu memeriksa fakta, sumber, dan logika output AI sebelum menggunakannya.",
      en: "I always verify facts, sources, and the logic of AI outputs before using them.",
    },
    weight: 1,
  },
  {
    id: "q3",
    dimension: {
      id: "Privasi & Keamanan Data",
      en: "Privacy & Data Security",
    },
    prompt: {
      id: "Saya menghindari memasukkan data pribadi, rahasia, atau kredensial ke dalam prompt AI.",
      en: "I avoid entering personal data, confidential info, or credentials into AI prompts.",
    },
    weight: 1,
  },
  {
    id: "q4",
    dimension: {
      id: "Kemandirian Berpikir",
      en: "Cognitive Agency",
    },
    prompt: {
      id: "Saya menggunakan AI sebagai alat bantu belajar/eksplorasi, bukan pengganti proses berpikir utama.",
      en: "I use AI as a learning/exploration aid rather than a replacement for my own thinking.",
    },
    weight: 1,
  },
];

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      questions: INITIAL_QUESTIONS,
      submissions: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw) as DatabaseSchema;
}

export function readDb(): DatabaseSchema {
  return ensureDb();
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getQuestions(): Question[] {
  return readDb().questions;
}
