import "express";

declare module "express-serve-static-core" {
  interface Request {
    vehicle_uid?: string;
    user_uid?: string;
    driver_uid?: string;
  }
}