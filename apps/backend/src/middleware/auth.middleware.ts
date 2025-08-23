import { Request, Response, NextFunction } from "express";
import { cryptoService } from "../services/crypto/crypto.service";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];
    const user = await cryptoService().validateToken(token);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ ok: false, message: "Acceso solo para administradores" });
    }

    (req as any).user = user;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ ok: false, message: "Token inválido o expirado" });
  }
}
