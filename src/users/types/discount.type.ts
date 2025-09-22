import { ObjectId } from "mongoose";

export interface Discount {
    _id?: string 
    user_id: ObjectId; // Cambia de string a ObjectId
    type: string;
    amount: number;
    is_active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}