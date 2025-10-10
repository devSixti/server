import { Types } from "mongoose";

export interface Device {
  user_id: Types.ObjectId;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}
