import type { DimensionKey } from "../types";

export type RecommendationLevel = "priority" | "general";

export interface RecommendationResource {
  label: string;
  url: string;
}

export interface Recommendation {
  id: string;
  dimension: DimensionKey;
  title: string;
  summary: string;
  actionItems: string[];
  level: RecommendationLevel;
  resource?: RecommendationResource;
}

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  frequency: "Frekuensi Penggunaan",
  reliance: "Porsi Kontribusi AI",
  transparency: "Transparansi Sitasi",
  ethics: "Kesadaran Etika",
  autonomy: "Kemandirian Kognitif",
};

export const RECOMMENDATIONS: Recommendation[] = [
  // ───────── FREQUENCY ─────────
  {
    id: "frequency-priority",
    dimension: "frequency",
    level: "priority",
    title: "Atur Waktu & Batas Porsi Riset AI",
    summary:
      "Frekuensi tinggi membuat AI menjadi jalan pertama setiap kali Anda belajar. Tetapkan batas agar sumber primer tetap menjadi fondasi riset.",
    actionItems: [
      "Terapkan aturan 70/30: minimal 70% waktu riset untuk membaca jurnal, buku, dan sumber primer; maksimal 30% untuk AI.",
      "Batasi AI maksimal satu blok 25 menit (Pomodoro) per sesi belajar.",
      "Catat log singkat: kapan memakai AI, untuk tujuan apa, dan berapa lama. Evaluasi tiap akhir pekan.",
      "Tetapkan minimal 2 hari bebas AI per minggu untuk membaca dan merangkum literatur sendiri.",
    ],
  },
  {
    id: "frequency-general",
    dimension: "frequency",
    level: "general",
    title: "Jaga Ritme Penggunaan AI",
    summary: "Pola frekuensi Anda relatif terkendali. Pertahankan dengan kebiasaan ringan.",
    actionItems: [
      "Tulis tujuan sebelum membuka AI agar sesi tidak melebar.",
      "Prioritaskan membaca sumber primer sebelum bertanya ke AI.",
    ],
  },

  // ───────── RELIANCE ─────────
  {
    id: "reliance-priority",
    dimension: "reliance",
    level: "priority",
    title: "Teknik Gradual Reduction",
    summary:
      "Kurangi porsi AI secara bertahap sampai berperan sebagai asisten, bukan penulis utama tugas Anda.",
    actionItems: [
      "Minggu 1–2: batasi AI hanya untuk brainstorming dan menyusun outline. Isi tugas ditulis sendiri.",
      "Minggu 3–4: tulis draf lengkap sendiri, lalu gunakan AI hanya untuk umpan balik struktur dan tata bahasa.",
      "Turunkan target kontribusi AI secara bertahap, misalnya dari lebih dari 50% menjadi di bawah 30% dari hasil akhir.",
      "Tandai di draf bagian mana yang ditulis sendiri dan mana yang dibantu AI, lalu kurangi yang terakhir tiap tugas.",
    ],
  },
  {
    id: "reliance-general",
    dimension: "reliance",
    level: "general",
    title: "Pertahankan AI sebagai Asisten",
    summary: "Porsi AI Anda masih wajar. Jaga agar tetap pada peran pendukung.",
    actionItems: [
      "Gunakan AI untuk ide dan penyuntingan, bukan penulisan isi utama.",
      "Tulis argumen inti dengan kata-kata sendiri sebelum meminta saran.",
    ],
  },

  // ───────── TRANSPARENCY ─────────
  {
    id: "transparency-priority",
    dimension: "transparency",
    level: "priority",
    title: "Tulis AI Disclosure Statement",
    summary:
      "Keterbukaan penggunaan AI melindungi integritas akademik Anda. Biasakan menyertakan pernyataan dan sitasi yang rapi.",
    actionItems: [
      "Tambahkan pernyataan di akhir tugas yang memuat nama alat, tanggal akses, tujuan penggunaan, dan bagian yang terdampak.",
      "Contoh: \"Saya menggunakan [alat] (diakses [tanggal]) untuk [tujuan]. Seluruh isi telah saya verifikasi dan sunting sendiri.\"",
      "Sitasi sesuai format yang diminta dosen (misalnya APA 7) dan simpan prompt serta keluaran penting sebagai bukti proses.",
      "Verifikasi setiap referensi yang disarankan AI. AI dapat menghasilkan sumber yang tidak ada.",
      "Cek kebijakan penggunaan AI pada setiap mata kuliah sebelum mengumpulkan tugas.",
    ],
    resource: {
      label: "Panduan APA Style",
      url: "https://apastyle.apa.org/",
    },
  },
  {
    id: "transparency-general",
    dimension: "transparency",
    level: "general",
    title: "Jaga Kebiasaan Sitasi",
    summary: "Transparansi Anda sudah baik. Jadikan itu rutinitas.",
    actionItems: [
      "Siapkan templat pernyataan penggunaan AI yang bisa dipakai ulang.",
      "Simpan riwayat prompt penting untuk setiap tugas.",
    ],
  },

  // ───────── ETHICS ─────────
  {
    id: "ethics-priority",
    dimension: "ethics",
    level: "priority",
    title: "Pahami Batas Plagiarisme Ide & Kode Etik",
    summary:
      "Menyajikan keluaran AI sebagai karya sendiri tanpa pengakuan termasuk pelanggaran integritas, meski teksnya \"baru\".",
    actionItems: [
      "Baca pedoman integritas akademik kampus dan kebijakan AI di silabus tiap mata kuliah.",
      "Ide atau argumen dari AI tetap perlu atribusi, walaupun sudah Anda parafrase.",
      "Uji diri: \"Jika dosen tahu seluruh prosesnya, apakah ini masih layak disebut karya saya?\" Jika ragu, nyatakan penggunaan AI.",
      "Bila aturan tidak jelas, tanyakan ke dosen sebelum mengumpulkan, bukan sesudahnya.",
    ],
    resource: {
      label: "Committee on Publication Ethics (COPE)",
      url: "https://publicationethics.org/",
    },
  },
  {
    id: "ethics-general",
    dimension: "ethics",
    level: "general",
    title: "Perkuat Kepekaan Etika",
    summary: "Kesadaran etika Anda baik. Terus perbarui sesuai aturan terbaru.",
    actionItems: [
      "Pantau pembaruan kebijakan AI di kampus dan mata kuliah Anda.",
      "Ajak rekan sekelas berdiskusi tentang batas penggunaan AI yang wajar.",
    ],
  },

  // ───────── AUTONOMY ─────────
  {
    id: "autonomy-priority",
    dimension: "autonomy",
    level: "priority",
    title: "Feynman Prompting & Kuis Mandiri",
    summary:
      "Uji pemahaman Anda tanpa bergantung pada AI, supaya nalar kritis tetap terlatih.",
    actionItems: [
      "Feynman Prompting: jelaskan konsep dengan kata sendiri tanpa melihat sumber, lalu minta AI mencari celah dan miskonsepsi pada penjelasan Anda, bukan memberi jawabannya.",
      "Minta AI membuat 5 soal latihan, kerjakan tanpa bantuan, lalu cocokkan hasilnya.",
      "Jadwalkan sesi \"AI-off\" 30 menit untuk mengerjakan soal dari nol.",
      "Tulis ringkasan satu paragraf dari ingatan sebelum membuka AI, lalu bandingkan dengan materi.",
    ],
  },
  {
    id: "autonomy-general",
    dimension: "autonomy",
    level: "general",
    title: "Pelihara Kemandirian Berpikir",
    summary: "Kemandirian Anda cukup baik. Jaga dengan latihan rutin.",
    actionItems: [
      "Coba selesaikan satu soal per minggu sepenuhnya tanpa AI.",
      "Evaluasi jawaban AI secara kritis sebelum dipakai.",
    ],
  },
];

/** Prioritas untuk dimensi terlemah, sisanya berlevel umum. */
export function getRecommendationPlan(weakest: DimensionKey): Recommendation[] {
  const priority = RECOMMENDATIONS.find(
    (r) => r.dimension === weakest && r.level === "priority"
  );
  const general = RECOMMENDATIONS.filter(
    (r) => r.level === "general" && r.dimension !== weakest
  );
  return priority ? [priority, ...general] : general;
}