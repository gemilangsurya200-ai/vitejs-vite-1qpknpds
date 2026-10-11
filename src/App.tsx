import { useState } from "react";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm, { type RegisterData } from "./components/auth/RegisterForm";
import AssessmentWizard from "./components/assessment/AssessmentWizard";
import Dashboard from "./pages/Dashboard";
import {
  buildUserId,
  clearUser,
  findUserByEmail,
  getLatestAssessment,
  getUser,
  saveAssessmentResult,
  saveUser,
} from "./utils/storage";
import {
  calculateDimensionScores,
  determinePersona,
  identifyWeakestDimension,
} from "./utils/scoringEngine";
import type { AssessmentAnswer, AssessmentResult, UserProfile } from "./types";

type View = "auth" | "assessment" | "dashboard";
type AuthMode = "login" | "register";

const createId = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export default function App() {
  // Auto-login dari localStorage saat pertama kali dimuat
  const [user, setUser] = useState<UserProfile | null>(() => getUser());
  const [result, setResult] = useState<AssessmentResult | null>(() =>
    getUser() ? getLatestAssessment() : null
  );
  const [view, setView] = useState<View>(() => {
    if (!getUser()) return "auth";
    return getLatestAssessment() ? "dashboard" : "assessment";
  });
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  /** Set sesi, lalu arahkan ke dashboard (jika sudah punya hasil) atau asesmen. */
  const startSession = (profile: UserProfile) => {
    saveUser(profile); // harus sebelum getLatestAssessment (riwayat per user)
    const latest = getLatestAssessment();
    setUser(profile);
    setResult(latest);
    setView(latest ? "dashboard" : "assessment");
  };

  const handleLogin = (email: string) => {
    const profile = findUserByEmail(email) ?? {
      id: buildUserId(email),
      email: email.trim(),
      academicYear: "Belum diatur",
    };
    startSession(profile);
  };

  const handleRegister = (data: RegisterData) => {
    startSession({
      id: buildUserId(data.email),
      email: data.email.trim(),
      academicYear: data.academicYear,
    });
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setResult(null);
    setAuthMode("login");
    setView("auth");
  };

  const handleAssessmentComplete = (answers: AssessmentAnswer[]) => {
    const dimensionScores = calculateDimensionScores(answers);
    const { persona } = determinePersona(dimensionScores);
    const dominantWeakness = identifyWeakestDimension(dimensionScores);

    const newResult: AssessmentResult = {
      id: createId(),
      timestamp: new Date().toISOString(),
      dimensionScores,
      persona,
      dominantWeakness,
    };

    saveAssessmentResult(newResult);
    setResult(newResult);
    setView("dashboard");
  };

  /* ───────── Render ───────── */

  if (view === "auth" || !user) {
    return (
      <AuthLayout>
        {authMode === "login" ? (
          <LoginForm
            onLoginSuccess={handleLogin}
            onSwitchToRegister={() => setAuthMode("register")}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegister}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}
      </AuthLayout>
    );
  }

  if (view === "dashboard" && result) {
    return (
      <Dashboard
        user={user}
        result={result}
        onNewAssessment={() => setView("assessment")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AssessmentWizard
      onComplete={handleAssessmentComplete}
      // Batal hanya tersedia jika sudah ada hasil sebelumnya untuk dikembalikan
      onCancel={result ? () => setView("dashboard") : undefined}
    />
  );
}