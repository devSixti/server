import { Document, ObjectId } from "mongodb";
import { TripStatus } from "./trip.status";
import { Driver, User } from "../../../users/types";

export interface Trip {
    passenger_id: ObjectId;
    driver_id: ObjectId;
    vehicle_id: ObjectId;
    trip_request_id: ObjectId;
    total_fare: number;
    discount_id?: ObjectId;
    final_fare: number;
    status: TripStatus;
    acceptedAt?: Date;
    driver: Driver;
    passenger: User;
     
  }