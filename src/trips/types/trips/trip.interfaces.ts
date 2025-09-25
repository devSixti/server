import { ObjectId } from "mongoose";
import { Location, ServiceType } from "../../../common/types";
import { RequestStatus } from "./request.status";
import { PaymentMethod } from "./payment.method";
import { User } from "../../../users/types";

export interface TripRequest {
  user_id: ObjectId;
  origin: Location;
  destination: Location;
  distance: number;
  route: {
    type: string;
    coordinates: Location[];
  };
  price: number;
  payment_method: PaymentMethod;
  service_type: ServiceType;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;

  // Virtual
  user_info?: User;
}
