import { Router, Request, Response } from "express";
import crypto from "crypto";
import { readDb, writeDb } from "../data/store";
import { AnswerItem, AssessmentSubmission, Lang, LocalizedText } from "../types";

const router = Router();

function parseLang(raw?: unknown): Lang {
  return raw === "en" ? "en" : "id";
}

function classifyScore(percentage: number): LocalizedText {
  if (percentage >= 80) {
    return {
      id: "Sangat Bertanggung Jawab",
      en: "Highly Responsible",
    };
  }
  if (percentage >= 55) {
    return {
      id: "Cukup Sadar & Berkembang",
      en: "Moderately Aware & Developing",
    };
  }
  return {
    id: "Perlu Penguatan Etika AI",
    en: "Needs AI Ethics Strengthening",
  };
}

// GET /api/questions?lang=id|en
router.get("/questions", (req: Request, res: Response) => {
  const lang = parseLang(req.query.lang);
  const db = readDb();

  const formatted = db.questions.map((q) => ({
    id: q.id,
    dimension: q.dimension[lang],
    dimensionRaw: q.dimension,
    prompt: q.prompt[lang],
    promptRaw: q.prompt,
    weight: q.weight,
  }));

  res.json({
    success: true,
    lang,
    data: formatted,
  });
});

// POST /api/assessments
router.post("/assessments", (req: Request, res: Response) => {
  const lang = parseLang(req.body?.lang);
  const answers = req.body?.answers as AnswerItem[] | undefined;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Answers array is required",
    });
  }

  const db = readDb();
  const questionMap = new Map(db.questions.map((q) => [q.id, q]));

  let totalScore = 0;
  let maxScore = 0;

  const dimensionTotals = new Map<
    string,
    { dimension: LocalizedText; sum: number; count: number }
  >();

  for (const item of answers) {
    const q = questionMap.get(item.questionId);
    if (!q) continue;

    const clampedScore = Math.min(5, Math.max(1, Number(item.score) || 1));
    const weightedScore = clampedScore * q.weight;
    const weightedMax = 5 * q.weight;

    totalScore += weightedScore;
    maxScore += weightedMax;

    const dimKey = q.dimension.en;
    const current = dimensionTotals.get(dimKey) || {
      dimension: q.dimension,
      sum: 0,
      count: 0,
    };
    current.sum += clampedScore;
    current.count += 1;
    dimensionTotals.set(dimKey, current);
  }

  if (maxScore === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid questionId matched in answers",
    });
  }

  const percentage = Math.round((totalScore / maxScore) * 1000) / 10;
  const level = classifyScore(percentage);

  const dimensionAverages = Array.from(dimensionTotals.entries()).map(
    ([key, val], idx) => ({
      dimensionId: `dim-${idx + 1}-${key.toLowerCase().replace(/\s+/g, "-")}`,
      dimension: val.dimension,
      dimensionLabel: val.dimension[lang],
      average: Math.round((val.sum / val.count) * 100) / 100,
    })
  );

  const submission: AssessmentSubmission = {
    id: `sub_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    lang,
    answers,
    totalScore,
    maxScore,
    percentage,
    level,
    dimensionAverages,
  };

  db.submissions.push(submission);
  writeDb(db);

  res.status(201).json({
    success: true,
    lang,
    data: {
      ...submission,
      levelLabel: level[lang],
    },
  });
});

export default router;
