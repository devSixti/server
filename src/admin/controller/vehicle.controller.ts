import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";

export class VehicleController {
  static async approve(req: Request, res: Response) {
    try {
      const vehicle = await VehicleService.approve(req.params.vehicleId);
      res.json(vehicle);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const vehicles = await VehicleService.getAll(req.query);
      res.json(vehicles);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  static async getByDriver(req: Request, res: Response) {
    try {
      const vehicles = await VehicleService.getByDriverId(req.params.driverId);
      res.json(vehicles);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}
