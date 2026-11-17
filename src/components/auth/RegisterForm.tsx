import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, Lock, Mail, User } from "lucide-react";
import { translations, type Language } from "../../data/translations";

export interface RegisterData {
  fullName: string;
  email: string;
  academicYear: string;
  password: string;
}

interface RegisterFormProps {
  onRegisterSuccess: (userData: RegisterData) => void;
  onSwitchToLogin: () => void;
  language: Language;
}

const SEMESTER_OPTIONS = [
  "Semester 1–2",
  "Semester 3–4",
  "Semester 5–6",
  "Di atas semester 6",
] as const;

const inputBase =
  "w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";
const iconBase =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";
const labelBase = "mb-1.5 block text-sm font-medium text-slate-700";

export default function RegisterForm({
  onRegisterSuccess,
  onSwitchToLogin,
  language,
}: RegisterFormProps) {
  const copy = translations[language];
  const semesterLabels =
    language === "id"
      ? SEMESTER_OPTIONS
      : ["Semesters 1–2", "Semesters 3–4", "Semesters 5–6", "Above semester 6"];
  const nameId = useId();
  const emailId = useId();
  const semId = useId();
  const pwId = useId();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !academicYear || !password) {
      setError(copy.completeFields);
      return;
    }
    if (password.length < 8) {
      setError(copy.passwordLength);
      return;
    }

    setError("");
    onRegisterSuccess({
      fullName: fullName.trim(),
      email: email.trim(),
      academicYear,
      password,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          {copy.createAccountTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {copy.createAccountSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Full name */}
        <div>
          <label htmlFor={nameId} className={labelBase}>{copy.fullName}</label>
          <div className="relative">
            <User className={iconBase} />
            <input
              id={nameId}
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={copy.fullName}
              className={`${inputBase} pr-3`}
            />
          </div>
        </div>

        {/* Email / Student ID */}
        <div>
          <label htmlFor={emailId} className={labelBase}>{copy.emailStudentId}</label>
          <div className="relative">
            <Mail className={iconBase} />
            <input
              id={emailId}
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.ac.id"
              className={`${inputBase} pr-3`}
            />
          </div>
        </div>

        {/* Semester */}
        <div>
          <label htmlFor={semId} className={labelBase}>{copy.academicLevel}</label>
          <div className="relative">
            <GraduationCap className={iconBase} />
            <select
              id={semId}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={`${inputBase} appearance-none pr-3 ${
                academicYear ? "text-slate-900" : "text-slate-400"
              }`}
            >
              <option value="" disabled>
                {copy.selectSemester}
              </option>
              {SEMESTER_OPTIONS.map((s, index) => (
                <option key={s} value={s} className="text-slate-900">
                  {semesterLabels[index]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor={pwId} className={labelBase}>{copy.password}</label>
          <div className="relative">
            <Lock className={iconBase} />
            <input
              id={pwId}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={copy.minimumPassword}
              className={`${inputBase} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? copy.hidePassword : copy.showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gradient px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-[0.99]"
        >
          {copy.createAccountButton}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        {copy.alreadyAccount}{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          {copy.signIn}
        </button>
      </p>
    </div>
  );
}