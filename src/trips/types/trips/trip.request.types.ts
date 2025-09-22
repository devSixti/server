import { ObjectId } from "mongoose";
import { Location, ServiceType } from "../../../common/types";
import { RequestStatus } from "./request.status";
import { User } from "../../../users/types";

export enum PaymentMethod {
    Cash = "cash",
    CreditCard = "credit_card"
}

export interface Route {
    type: string;
    coordinates: Location[];
}

export enum TripRequestActions {

    PROPOSE = "propose",
    ACCEPT = "accept",
    REJECT = "reject"
}


export interface TripRequest {
    user_id: ObjectId;
    origin: Location; // [longitude, latitude]
    destination: Location; // [longitude, latitude]
    distance: number;
    route: Route;
    price: number;
    paymant_method: PaymentMethod;
    service_type: ServiceType;
    status: RequestStatus;
    createdAt?: Date;
    updatedAt?: Date;

    user_info?: User
}