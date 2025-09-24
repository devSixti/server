import { Request, Response, NextFunction } from "express";
import { TripNegotiationService } from "../services/trip.negotiation.service";

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export class TripNegotiationController {
  /**
   * POST /trips/negotiation
   */
  static negotiate = catchAsync(async (req: Request, res: Response) => {
    const opts = req.body; // contiene driverId, vehicleId, tripRequestId, action, etc.
    const result = await TripNegotiationService.handleNegotiation(opts);
    res.json({ status: "success", data: result });
  });
}
