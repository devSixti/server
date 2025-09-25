import { Request, Response, NextFunction } from "express";
import { TripRequestService } from "../services/trip.request.service";

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export class TripRequestController {
  /**
   * POST /trips/requests
   */
  static create = catchAsync(async (req: Request, res: Response) => {
    const { userId, tripInfo } = req.body; // <-- recibimos userId desde el body

    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized: user not found" });
    }

    const result = await TripRequestService.createTripRequest(userId, tripInfo);
    res.json({ status: "success", data: result });
  });
}
