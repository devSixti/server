import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; // Usar ObjectId de Mongoose
  first_name: string;
  last_name?: string;
  nick_name?: string;
  country?: string;
  city?: string;
  document: {
    document_id: string;
    type: string;
    verified?: boolean;
  };
  email: {
    address: string;
  };
  phone: {
    country_code: string;
    number: string;
  };
  driver?: Types.ObjectId;
  device?: Types.ObjectId;
}