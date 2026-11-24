import { Router, Request, Response } from "express";
import crypto from "crypto";
import { readDb, writeDb } from "../data/store";
import { requireAdmin } from "../middleware/auth";
import { Lang, Question } from "../types";

const router = Router();

function parseLang(raw?: unknown): Lang {
  return raw === "en" ? "en" : "id";
}

// POST /api/admin/login
router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  const validUser = process.env.ADMIN_USER || "admin";
  const validPass = process.env.ADMIN_PASS || "admin123";
  const token = process.env.ADMIN_TOKEN || "ai-ethic-admin-secret-token";

  if (username === validUser && password === validPass) {
    return res.json({
      success: true,
      token,
      admin: { username: validUser, role: "admin" },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin credentials",
  });
});

// GET /api/admin/overview?lang=id|en
router.get("/overview", requireAdmin, (req: Request, res: Response) => {
  const lang = parseLang(req.query.lang);
  const db = readDb();

  const totalSubmissions = db.submissions.length;
  const avgPercentage =
    totalSubmissions > 0
      ? Math.round(
          (db.submissions.reduce((acc, s) => acc + s.percentage, 0) /
            totalSubmissions) *
            10
        ) / 10
      : 0;

  const dimensionAgg = new Map<
    string,
    { label: string; sum: number; count: number }
  >();

  for (const sub of db.submissions) {
    for (const dim of sub.dimensionAverages) {
      const label = dim.dimension[lang];
      const existing = dimensionAgg.get(label) || { label, sum: 0, count: 0 };
      existing.sum += dim.average;
      existing.count += 1;
      dimensionAgg.set(label, existing);
    }
  }

  const chartByDimension = Array.from(dimensionAgg.values()).map((item) => ({
    dimension: item.label,
    averageScore: Math.round((item.sum / item.count) * 100) / 100,
  }));

  res.json({
    success: true,
    lang,
    data: {
      totalSubmissions,
      totalQuestions: db.questions.length,
      averagePercentage: avgPercentage,
      chartByDimension,
      recentSubmissions: db.submissions.slice(-10).reverse(),
    },
  });
});

// GET /api/admin/questions
router.get("/questions", requireAdmin, (_req: Request, res: Response) => {
  const db = readDb();
  res.json({
    success: true,
    data: db.questions,
  });
});

// POST /api/admin/questions
router.post("/questions", requireAdmin, (req: Request, res: Response) => {
  const { dimensionId, dimensionEn, promptId, promptEn, weight } = req.body || {};

  if (!promptId || !promptEn) {
    return res.status(400).json({
      success: false,
      message: "promptId and promptEn are required",
    });
  }

  const newQuestion: Question = {
    id: `q_${crypto.randomUUID().slice(0, 6)}`,
    dimension: {
      id: dimensionId || "Etika Umum",
      en: dimensionEn || "General Ethics",
    },
    prompt: {
      id: promptId,
      en: promptEn,
    },
    weight: Math.min(5, Math.max(1, Number(weight) || 1)),
  };

  const db = readDb();
  db.questions.push(newQuestion);
  writeDb(db);

  res.status(201).json({
    success: true,
    data: newQuestion,
  });
});

// DELETE /api/admin/questions/:id
router.delete("/questions/:id", requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const nextQuestions = db.questions.filter((q) => q.id !== id);

  if (nextQuestions.length === db.questions.length) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }

  db.questions = nextQuestions;
  writeDb(db);

  res.json({
    success: true,
    message: "Question deleted",
  });
});

export default router;
