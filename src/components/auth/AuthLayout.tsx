import type { ReactNode } from "react";
import { BarChart3, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  { icon: BarChart3, title: "Track", description: "Track your AI usage" },
  { icon: ShieldCheck, title: "Reflect", description: "Reflect on your habits" },
  { icon: TrendingUp, title: "Improve", description: "Improve your academic skills" },
];

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-2">
      {/* Brand Panel */}
      <aside className="relative flex flex-col justify-between overflow-hidden bg-brand-gradient px-6 py-10 text-white sm:px-12 lg:px-16 lg:py-16">
        {/* dekorasi */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent-300/20 blur-3xl" />

        <header className="relative">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary-100">
            AI-ETHIC METER
          </span>
        </header>

        <div className="relative my-10 lg:my-0">
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Understand your AI usage.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-primary-100 sm:text-lg">
            Track how you use AI platforms for your semester and build better
            academic habits.
          </p>

          <ul className="mt-10 space-y-5">
            {PILLARS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold">{title}</p>
                  <p className="text-sm text-primary-100">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <footer className="relative hidden text-xs text-primary-200 lg:block">
          © {new Date().getFullYear()} AI-ETHIC METER
        </footer>
      </aside>

      {/* Form Panel */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-xl2 border border-slate-100 bg-white p-8 shadow-card sm:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}