import { Driver } from "./driver.type";
import { Discount } from "./discount.type";
import { Device } from "./Device.type";
import { Phone } from "./phone.type";
import { Document, Location } from "../../common/types";
import { Roles } from "./roles.types";
import { Califications } from "./Califications.type";
import { Types } from "mongoose";


export interface User {
  _id: string;
  first_name: string;
  last_name?: string;
  nick_name?: string;
  role_id?: Types.ObjectId;
  country?: string;
  picture?: string;
  city?: string;
  email?: {
    address: string;
    verified: boolean;
  }
  role?: Roles;
  role_name?: string;
  birth_date?: Date;
  document: Document;
  current_location?: Location;
  phone?: Phone;
  emergency_contact?: Phone;
  address?: string;
  is_active?: boolean;
  createdAt?: Date;
  driver?: Driver;
  device?: Device;
  discounts?: Discount[];
  califications?: Califications[];
}
