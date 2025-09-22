import { Types, ObjectId } from "mongoose";
import { Status } from "../../common/types";
import { Vehicle } from "./vehicle.type";
import { User } from "./user.types";
import { Wallet } from "./wallet.type";

export interface Driver {
  id: string;
  user_id: Types.ObjectId; 
  vehicle_id?: Types.ObjectId;
  license: {
    front_picture?: string; 
    back_picture?: string; 
    expiration_date: Date,
    verified?: boolean; 
  };
  criminal_background: {
    picture: string; 
    verified: boolean; 
    
  }
  user_info?: User;
  vehicles?: Vehicle[];
  vehicle_selected: Vehicle;
  is_available: boolean;
  status_request: Status; 
  wallet: Wallet
}

interface FrontDriverData {
  userId: string;
  document: {
    documentId: string;
    frontPhotoUrl: string;
    backPhotoUrl: string;
  };
  email?: string;
  license?: {
    licenseId: string;
    frontPhotoUrl: string;
    backPhotoUrl: string;
    validationPhotoUrl: string;
  };
  firstName: string;
  lastName: string;
  profilePhoto: string;
  phone: {
    code: string;
    country: string;
    number: string;
  };
  emergencyNumber?: {
    code: string;
    country: string;
    number: string;
  };
  soatPhotoUrl?: string;
  goodConductPhotoUrl: string;
  // typeIndexes?: VehicleType[]
  vehicle?: {
    vehiclePhotoUrl?: string;
    propertyCard?: {
      frontPhotoUrl?: string;
      backPhotoUrl?: string;
    };
    plates?: string;
    details?: {
      brand?: string;
      model?: string;
      color?: string;
    };
  };
  deliveries?: boolean;
}
