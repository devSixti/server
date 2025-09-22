import { ObjectId } from "mongoose";

export interface Wallet {
    _id?: string;
    driver_id: ObjectId;
    balance: number;
    currency: string;
    createdAt?: Date;
    updatedAt?: Date;
}