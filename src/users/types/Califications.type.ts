import { Types } from "mongoose";

export interface Califications {
    trip_id: Types.ObjectId;
    from_user_id: Types.ObjectId;
    to_user_id: Types.ObjectId;
    rating: number;
    comment?: string;
}