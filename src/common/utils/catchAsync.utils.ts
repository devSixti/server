import { Request, Response, NextFunction } from "express";

/**
 * catchAsync
 * Wrapper para manejar errores de forma centralizada en controladores async
 */
export const catchAsync =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
