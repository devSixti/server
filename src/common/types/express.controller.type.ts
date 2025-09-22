import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  uid?: string;
  driver_uid?: string;
  vehicle_uid?: string;
}

export type ExpressController = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;


export type ErrorsController = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void;