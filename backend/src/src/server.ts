import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import assessmentRoutes from "./routes/assessment.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ai-ethic-meter-backend" });
});

app.use("/api", assessmentRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
