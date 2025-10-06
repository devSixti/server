import { Types } from "mongoose";
import { ServiceType, Status, VehicleType } from "../../common/types";
import { Driver } from "./driver.type";


export enum FuelType {
  gasoline = "gasoline",
  diesel = "diesel",
  electric = "electric",
  hybrid = "hybrid",
  gnc = "gnc"
}

export interface VehiclePictures {
  front_picture: string;
  back_picture: string;
  inside_picture: string;
}

export interface Vehicle {
  _id: string;
  driver_id: Types.ObjectId;
  plates?: string;
  type: VehicleType;
  services: ServiceType[];
  property_card: {
    front_picture: string;
    back_picture: string;
    verified?: boolean;
  };
  mandatory_insurance: {
    picture: string;
    expiration_date: Date
    verified: boolean;
  };
  optional_risk_insurance?: {
    picture?: string;
    verified?: boolean;
  };
  technical_mechanical: {
    picture?: string;
    expiration_date: Date
    verified?: boolean;
  };

  pictures: VehiclePictures;
  brand: string;
  model: string;
  year: number;
  color: string;
  capacity: number;
  fuel_type?: FuelType;

  driver?: Driver;
  status_request?: Status;
  createdAt?: Date;
  updatedAt?: Date;

  frontPicture?: string;
  backPicture?: string;
  insidePicture?: string;

  frontPropertyCard?: string;
  backPropertyCard?: string;
  verifiedPropertyCard?: boolean;

  verifiedMandatoryInsurance?: boolean;
  pictureMandatoryInsurance?: string;
  expirationDateMandatoryInsurance?: Date;

  verifiedTechnicalMechanical?: boolean;
  pictureTechnicalMechanical?: string;
  expirationDateTechnicalMechanical?: Date;

  delete_request?: {
    requested: boolean;   
    reason?: string;   
    requested_at?: Date;    
    reviewed_at?: Date;          
    status: "pending" | "approved" | "rejected" | "cancelled"; 
  };

}
