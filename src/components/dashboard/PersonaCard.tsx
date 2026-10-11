import { AlertTriangle, BookOpen, Compass, ShieldAlert, type LucideIcon } from "lucide-react";
import type { PersonaType } from "../../types";

interface PersonaCardProps {
  persona: PersonaType;
  description: string;
}

interface PersonaTheme {
  icon: LucideIcon;
  status: string;
  implication: string;
  card: string;
  iconWrap: string;
  badge: string;
  title: string;
  divider: string;
}

// Class lengkap ditulis statis agar terdeteksi oleh Tailwind (tanpa interpolasi dinamis).
const THEMES: Record<PersonaType, PersonaTheme> = {
  "Strategic Co-Pilot": {
    icon: Compass,
    status: "Sehat & Mandiri",
    implication:
      "AI mendukung proses belajar tanpa menggantikan nalar Anda. Pertahankan kebiasaan sitasi dan terus verifikasi keluaran AI.",
    card: "border-emerald-200 bg-emerald-50/60",
    iconWrap: "bg-emerald-100 text-emerald-600 ring-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    title: "text-emerald-900",
    divider: "border-emerald-200",
  },
  "Ethical Pragmatist": {
    icon: BookOpen,
    status: "Sadar Aturan",
    implication:
      "Anda memahami batas etika, tetapi konsistensi sitasi dan latihan berpikir mandiri masih bisa ditingkatkan.",
    card: "border-indigo-200 bg-indigo-50/60",
    iconWrap: "bg-indigo-100 text-indigo-600 ring-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    title: "text-indigo-900",
    divider: "border-indigo-200",
  },
  "Vulnerable Dependent": {
    icon: AlertTriangle,
    status: "Ketergantungan Kognitif",
    implication:
      "Kepercayaan diri tanpa AI cenderung rendah. Mulailah dari draf mandiri, lalu gunakan AI hanya untuk menyempurnakan.",
    card: "border-amber-200 bg-amber-50/60",
    iconWrap: "bg-amber-100 text-amber-600 ring-amber-200",
    badge: "bg-amber-100 text-amber-700",
    title: "text-amber-900",
    divider: "border-amber-200",
  },
  "High-Risk Shortcutter": {
    icon: ShieldAlert,
    status: "Risiko Integritas",
    implication:
      "Pola pakai saat ini berisiko pada pelanggaran integritas akademik. Segera nyatakan penggunaan AI dan kurangi porsi AI pada isi tugas.",
    card: "border-rose-200 bg-rose-50/60",
    iconWrap: "bg-rose-100 text-rose-600 ring-rose-200",
    badge: "bg-rose-100 text-rose-700",
    title: "text-rose-900",
    divider: "border-rose-200",
  },
};

export default function PersonaCard({ persona, description }: PersonaCardProps) {
  const theme = THEMES[persona];
  const Icon = theme.icon;

  return (
    <article className={`rounded-xl2 border p-5 shadow-card sm:p-6 ${theme.card}`}>
      <div className="flex items-start gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-4 ${theme.iconWrap}`}
        >
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}
          >
            {theme.status}
          </span>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            Persona Anda
          </p>
          <h3 className={`font-display text-2xl font-extrabold ${theme.title}`}>
            {persona}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">{description}</p>

      <div className={`mt-5 border-t pt-4 ${theme.divider}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Implikasi bagi kebiasaan belajar
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
          {theme.implication}
        </p>
      </div>
    </article>
  );
}