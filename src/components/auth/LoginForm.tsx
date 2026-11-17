import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import { translations, type Language } from "../../data/translations";

interface LoginFormProps {
  onLoginSuccess: (email: string) => void;
  onSwitchToRegister: () => void;
  onAdminLogin: () => void;
  language: Language;
}

export default function LoginForm({
  onLoginSuccess,
  onSwitchToRegister,
  onAdminLogin,
  language,
}: LoginFormProps) {
  const copy = translations[language];
  const idId = useId();
  const pwId = useId();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError(copy.signInError);
      return;
    }
    setError("");
    onLoginSuccess(identifier.trim());
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          {copy.loginTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {copy.loginSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Identifier */}
        <div>
          <label htmlFor={idId} className="mb-1.5 block text-sm font-medium text-slate-700">
            {copy.studentIdEmail}
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id={idId}
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@university.ac.id"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor={pwId} className="mb-1.5 block text-sm font-medium text-slate-700">
            {copy.password}
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id={pwId}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            {copy.rememberMe}
          </label>
          <a href="#" className="font-medium text-primary-600 hover:text-primary-700">
            {copy.forgotPassword}
          </a>
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
          {copy.signIn}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <button
        type="button"
        onClick={onAdminLogin}
        className="mt-3 flex w-full items-center justify-center rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        {copy.adminSignIn}
      </button>

      <p className="mt-8 text-center text-sm text-slate-500">
        {copy.noAccount}{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          {copy.createAccount}
        </button>
      </p>
    </div>
  );
}