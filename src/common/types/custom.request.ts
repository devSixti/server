import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    uid?: string;
    vehicle_uid?: string;
    token?: string;
  }
}