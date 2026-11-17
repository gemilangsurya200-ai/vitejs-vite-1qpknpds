import type {
  AssessmentResult,
  DimensionScores,
  PersonaType,
  StudentAssessmentRecord,
  UserProfile,
} from "../types";

const KEY_SESSION = "aem:session";
const KEY_USERS = "aem:users";
const keyHistory = (userId: string) => `aem:history:${userId}`;
const MAX_HISTORY = 50;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[storage] gagal menyimpan "${key}"`, err);
  }
}

function isUserProfile(v: unknown): v is UserProfile {
  if (!v || typeof v !== "object") return false;
  const u = v as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.email === "string" &&
    typeof u.academicYear === "string"
  );
}

function isAssessmentResult(v: unknown): v is AssessmentResult {
  if (!v || typeof v !== "object") return false;
  const result = v as Record<string, unknown>;
  const scores = result.dimensionScores as Partial<DimensionScores> | undefined;
  return (
    typeof result.id === "string" &&
    typeof result.timestamp === "string" &&
    !!scores &&
    ["frequency", "reliance", "transparency", "ethics", "autonomy"].every(
      (key) => typeof scores[key as keyof DimensionScores] === "number"
    ) &&
    typeof result.persona === "string" &&
    typeof result.dominantWeakness === "string"
  );
}

/** ID deterministik dari email, agar riwayat tetap terhubung setelah logout/login. */
export const buildUserId = (email: string): string =>
  `user_${email.trim().toLowerCase()}`;

/* ───────── User / session ───────── */

export function saveUser(user: UserProfile): void {
  write(KEY_SESSION, user);
  const users = read<Record<string, UserProfile>>(KEY_USERS, {});
  users[user.email.trim().toLowerCase()] = user;
  write(KEY_USERS, users);
}

export function getUser(): UserProfile | null {
  const user = read<unknown>(KEY_SESSION, null);
  return isUserProfile(user) ? user : null;
}

/** Mengakhiri sesi. Profil terdaftar dan riwayat asesmen tetap tersimpan. */
export function clearUser(): void {
  try {
    localStorage.removeItem(KEY_SESSION);
  } catch {
    /* abaikan */
  }
}

export function findUserByEmail(email: string): UserProfile | null {
  const users = read<Record<string, unknown>>(KEY_USERS, {});
  const found = users[email.trim().toLowerCase()];
  return isUserProfile(found) ? found : null;
}

/* ───────── Assessment (dipisah per user yang sedang login) ───────── */

export function saveAssessmentResult(result: AssessmentResult): void {
  const user = getUser();
  if (!user) return;
  const history = getAssessmentHistory();
  write(keyHistory(user.id), [...history, result].slice(-MAX_HISTORY));
}

export function getAssessmentHistory(): AssessmentResult[] {
  const user = getUser();
  if (!user) return [];
  const history = read<unknown>(keyHistory(user.id), []);
  return Array.isArray(history) ? (history as AssessmentResult[]) : [];
}

export function getLatestAssessment(): AssessmentResult | null {
  const history = getAssessmentHistory();
  return history.length ? history[history.length - 1] : null;
}

/** Returns the latest locally stored assessment for every registered student. */
export function getAllStudentAssessmentRecords(): StudentAssessmentRecord[] {
  const users = read<Record<string, unknown>>(KEY_USERS, {});
  return Object.values(users).flatMap((value) => {
    if (!isUserProfile(value)) return [];
    const history = read<unknown>(keyHistory(value.id), []);
    if (!Array.isArray(history)) return [];
    const latest = [...history].reverse().find(isAssessmentResult);
    return latest ? [{ user: value, result: latest }] : [];
  });
}