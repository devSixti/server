import { Types } from "mongoose";

export interface Device {
  userId: Types.ObjectId;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}
