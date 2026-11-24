import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.ADMIN_TOKEN || "ai-ethic-admin-secret-token";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing Bearer token",
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (token !== expectedToken) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid admin token",
    });
  }

  next();
}
