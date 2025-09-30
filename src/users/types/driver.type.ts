import { Types } from "mongoose";
import { Status } from "../../common/types"; 
import { Vehicle } from "./vehicle.type";
import { User } from "./user.types";

/**
 * Params para create/update driver
 */
export interface DriverParams {
  userId: string;
}

/**
 * Params para consultar info de un driver
 */
export interface DriverRequestParams {
  driverId: string;
}

/**
 * Params para cambiar disponibilidad del driver
 */
export interface DriverAvailabilityParams {
  driverId: string;
}

/**
 * Params para cambiar rol del driver
 */
export interface DriverRoleParams {
  userId: string;
}

/**
 * DTO para create/update driver
 */
export interface CreateOrUpdateDriverDTO {
  frontLicense: string;
  backLicense: string;
  expirationDate: Date;
  pictureCriminalBackground: string;
  vehicleId: string[]; // se envía un array de vehicles

}

/**
 * Representación de un Driver en DB
 */
export interface Driver {
  _id: Types.ObjectId;
  id?: string;
  user_id: Types.ObjectId;
  vehicle_id?: Types.ObjectId | Vehicle[];
  user_info?: User;
  license: {
    front_picture?: string;
    back_picture?: string;
    expiration_date: Date;
    verified?: boolean;
  };
  criminal_background: {
    picture: string;
    verified: boolean;
  };
  is_available: boolean;
  status_request: Status;

  // ✅ Agregar virtuals de Mongoose
  vehicles?: Vehicle[];
  vehicle_selected?: Vehicle;
  wallet?: any;
}

