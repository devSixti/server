import { Types } from "mongoose"; // Usar `Types` de Mongoose para ObjectId

export interface Discount {
    _id?: Types.ObjectId;
    user_id?: Types.ObjectId | null;
    type?: string | null;
    amount: number;
    is_active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
