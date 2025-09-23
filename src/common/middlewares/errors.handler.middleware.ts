import { Request, Response, NextFunction } from "express";

export const errorsCatcher = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err.message, err.statusCode || 500);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    errorType: err.name || "ErrorDesconocido",
    message:
      err.message ||
      "Ha ocurrido un error interno en el servidor. Por favor, inténtalo más tarde.",
  });
};
