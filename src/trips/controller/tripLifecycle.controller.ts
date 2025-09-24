import { Request, Response, NextFunction } from "express";
import { TripLifecycleService } from "../services/tripLifecycle.service";
import { TripStatus } from "../types";

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export class TripLifecycleController {
  static changeStatus = catchAsync(async (req: Request, res: Response) => {
    const { tripId } = req.params;
    const { nextStatus, userId } = req.body; // <-- userId lo pasamos desde el body

    const result = await TripLifecycleService.changeStatus(
      tripId,
      userId,
      nextStatus as TripStatus
    );
    res.json({ status: "success", data: result });
  });

  static arrived = catchAsync(async (req: Request, res: Response) => {
    const { tripId, driverId } = req.body; // driverId lo pasamos desde el body

    const result = await TripLifecycleService.markDriverArrived(tripId, driverId);
    res.json({ status: "success", data: result });
  });

  static start = catchAsync(async (req: Request, res: Response) => {
    const { tripId, driverId } = req.body;

    const result = await TripLifecycleService.startTrip(tripId, driverId);
    res.json({ status: "success", data: result });
  });

  static finish = catchAsync(async (req: Request, res: Response) => {
    const { tripId, driverId } = req.body;

    const result = await TripLifecycleService.finishTrip(tripId, driverId);
    res.json({ status: "success", data: result });
  });

  static cancel = catchAsync(async (req: Request, res: Response) => {
    const { tripId, userId } = req.body;

    const result = await TripLifecycleService.cancelTrip(tripId, userId);
    res.json({ status: "success", data: result });
  });
}
